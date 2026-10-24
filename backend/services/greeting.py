from backend.domain.greeting import Greeting


def get_greeting() -> Greeting:
    return Greeting(message="Hello, World!")
