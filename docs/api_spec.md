# DigitalOrbit API Specification

All routes are prefixed with `/api`.

## Auth Endpoints
- `POST /auth/login`: Authenticate a user and set cookie.
- `POST /auth/register`: Create a new user account.
- `POST /auth/logout`: Invalidate cookies.
- `GET /auth/me`: Get currently logged in user info.

## Public / Business Endpoints
- `POST /contact`: Submit query from contact form.
- `GET /services`: Retrieve list of active services.
- `GET /portfolio`: Retrieve list of projects.
- `GET /blog`: Retrieve published blogs.
- `GET /testimonials`: Retrieve featured testimonials.
