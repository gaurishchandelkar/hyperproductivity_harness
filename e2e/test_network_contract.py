"""Inside (whitebox) checks: the exact requests the browser sends and what the backend returns."""

from playwright.sync_api import Page, expect

from e2e.network import ApiTraffic, Signature

LOAD: Signature = ("GET", "/api/hello", {})


def _greet(page: Page, name: str) -> None:
    page.goto("/")
    expect(page.get_by_role("heading", name="Hello, World!")).to_be_visible()
    page.get_by_label("Your name").fill(name)
    page.get_by_role("button", name="Greet").click()


def test_load_requests_default_greeting_once(page: Page, traffic: ApiTraffic) -> None:
    page.goto("/")
    expect(page.get_by_role("heading", name="Hello, World!")).to_be_visible()
    page.wait_for_load_state("networkidle")

    calls = traffic.api_calls()
    assert [call.signature for call in calls] == [LOAD], traffic.describe()
    assert (calls[0].status, calls[0].json()) == (200, {"message": "Hello, World!"})


def test_greet_sends_trimmed_name_once(page: Page, traffic: ApiTraffic) -> None:
    _greet(page, "  Ada  ")
    expect(page.get_by_role("heading", name="Hello, Ada!")).to_be_visible()
    page.wait_for_load_state("networkidle")

    calls = traffic.api_calls()
    greet = ("GET", "/api/hello", {"name": ["Ada"]})
    assert [call.signature for call in calls] == [LOAD, greet], traffic.describe()
    assert (calls[1].status, calls[1].json()) == (200, {"message": "Hello, Ada!"})


def test_greet_sends_full_name_intact(page: Page, traffic: ApiTraffic) -> None:
    _greet(page, "Ada Lovelace")
    expect(page.get_by_role("heading", name="Hello, Ada Lovelace!")).to_be_visible()
    page.wait_for_load_state("networkidle")

    calls = traffic.api_calls()
    greet = ("GET", "/api/hello", {"name": ["Ada Lovelace"]})
    assert [call.signature for call in calls] == [LOAD, greet], traffic.describe()
    assert (calls[1].status, calls[1].json()) == (200, {"message": "Hello, Ada Lovelace!"})


def test_markup_gets_generic_422_without_echo(page: Page, traffic: ApiTraffic) -> None:
    markup = "<script>alert(1)</script>"
    _greet(page, markup)
    expect(page.get_by_role("alert")).to_contain_text("Please enter a valid name")
    page.wait_for_load_state("networkidle")

    calls = traffic.api_calls()
    greet = ("GET", "/api/hello", {"name": [markup]})
    assert [call.signature for call in calls] == [LOAD, greet], traffic.describe()
    assert (calls[1].status, calls[1].json()) == (422, {"detail": "Invalid request"})
    assert "script" not in (calls[1].body or "")
    assert "alert(1)" not in (calls[1].body or "")
