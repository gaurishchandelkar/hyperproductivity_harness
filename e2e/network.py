"""Records the browser's traffic so tests can assert the exact API calls (the network contract)."""

import json
from dataclasses import dataclass
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import Page, Request


def origin(url: str) -> str:
    parts = urlsplit(url)
    return f"{parts.scheme}://{parts.netloc}"


type Signature = tuple[str, str, dict[str, list[str]]]
"""(method, path, decoded query): what identifies an API call in an assertion."""


@dataclass(frozen=True)
class Call:
    method: str
    url: str
    path: str
    query: dict[str, list[str]]
    status: int | None
    body: str | None

    @property
    def signature(self) -> Signature:
        return (self.method, self.path, self.query)

    def json(self) -> object:
        return json.loads(self.body or "null")


def _call(request: Request) -> Call:
    parts = urlsplit(request.url)
    response = request.response()
    return Call(
        method=request.method,
        url=request.url,
        path=parts.path,
        query=parse_qs(parts.query, keep_blank_values=True),
        status=response.status if response else None,
        body=response.text() if response else None,
    )


class ApiTraffic:
    """Every request the page makes, in order, with its response."""

    def __init__(self, page: Page) -> None:
        self._requests: list[Request] = []

        # Playwright tags its handlers, so this has to be a plain function, not list.append.
        def record(request: Request) -> None:
            self._requests.append(request)

        page.on("request", record)

    def calls(self) -> list[Call]:
        return [_call(request) for request in self._requests]

    def api_calls(self) -> list[Call]:
        return [call for call in self.calls() if call.path.startswith("/api/")]

    def foreign_origins(self, allowed: str) -> list[str]:
        return sorted({origin(r.url) for r in self._requests} - {allowed})

    def describe(self) -> str:
        # Bodies only for API calls: page assets would bury them.
        seen = [
            f"  {c.method} {c.url} -> {c.status}"
            + (f" {c.body!r}" if c.path.startswith("/api/") else "")
            for c in self.calls()
        ]
        return "Requests seen:\n" + ("\n".join(seen) or "  (none)")
