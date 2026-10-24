from backend.api.routes import health, hello
from backend.domain.greeting import Greeting
from backend.services.greeting import get_greeting


def test_service_returns_hello_world() -> None:
    assert get_greeting() == Greeting(message="Hello, World!")


def test_hello_route_wraps_service_greeting() -> None:
    assert hello().message == "Hello, World!"


def test_health_route_reports_ok() -> None:
    assert health().status == "ok"
