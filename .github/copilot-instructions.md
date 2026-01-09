# Minicom - AI Agent Instructions

## Project Purpose
Interview preparation project simulating Intercom's messaging system. Candidates build messaging features in 45-minute sprints during live coding interviews. **Scrappy, working code is valued over perfect architecture.**

## Architecture Overview

**Multi-framework monorepo** with identical API contracts across 4 backend implementations:
- `django/` - Python/Django (SQLite)
- `rails/` - Ruby on Rails (SQLite)  
- `node/` - Express.js (JSON file DB)
- `spring/` - Java/Spring Boot (H2 in-memory)

**Shared frontends:**
- `foo-website/` - Customer interface (port 8008) - sends messages
- `bar-website/` - Support agent interface (port 8009) - reads/replies to messages

**Critical constraint:** All backends must implement identical endpoints (`POST /foo`, `POST /bar`) that frontends expect at `http://localhost:3000`.

## Development Workflows

### Starting the System (3 terminals required)
```bash
# Terminal 1: Customer site
script/foo/start

# Terminal 2: Support site  
script/bar/start

# Terminal 3: Backend (choose one framework)
script/django/start   # or rails/node/spring
```

### Django-Specific Commands
```bash
# Setup (first time only)
script/django/setup

# Database migrations (Django doesn't play well with SQLite migrations)
# Recommended: Nuke and recreate for schema changes
source django/venv/bin/activate
rm -f django/db.sqlite3
python django/manage.py makemigrations
python django/manage.py migrate

# Database console
cd django && source venv/bin/activate
./manage.py dbshell
# SQLite commands: .tables, .dump <table_name>
```

### Rails-Specific Commands
```bash
script/rails/setup
script/rails/start

# From rails/ directory:
bin/rails generate migration AddColumnName
rake db:migrate
rake db:reset  # Purge all data
```

## Code Patterns & Conventions

### Django Backend (`django/minicom/`)
- **No models.py file exists** - candidate creates from scratch
- **CSRF disabled** in `settings.py` for interview simplicity
- **CORS enabled globally** via `django-cors-headers` 
- **API pattern:** Simple JSON responses via `api.py::render_to_json()`
- **URL routing:** Direct function mapping in `urls.py` (no class-based views)

Example endpoint structure:
```python
# minicom/api.py
def verify(request):
    return render_to_json({'success': True})

# minicom/urls.py
urlpatterns = [
    path('foo', api.verify),
    path('bar', api.verify)
]
```

### Frontend Integration
- **jQuery AJAX** for all API calls (not fetch)
- **Error handling:** Displays alert with generic message on any failure
- **Success detection:** Checks `response.success === true`
- **No authentication** - simplified for interview

Example frontend pattern (`foo.js`, `bar.js`):
```javascript
async verify() {
  try {
    let response = await $.post(this.fooEndpoint).then();
    if (response.success === true) {
      alert('Yay! Everything works');
    }
  } catch (error) {
    alert('There has been a problem with the request');
  }
}
```

## Critical Gotchas

1. **Port mismatch:** Django start script was hardcoded to port 3001 (now fixed to 3000). Verify `script/django/start` uses port 3000.

2. **Virtual environment:** Django requires `django/venv/` to exist. If missing, run `script/django/setup`.

3. **All three processes required:** Foo/Bar sites fail silently if backend isn't running on port 3000.

4. **Database reset workflow:** For Django schema changes, delete `db.sqlite3` and re-run migrations. Don't try incremental migrations with SQLite.

5. **CORS already configured:** Don't add CORS middleware - it's in `settings.py` (`CORS_ORIGIN_ALLOW_ALL = True`).

6. **Python import cache:** If Django throws `AttributeError: module has no attribute 'function_name'` after adding new functions, the Python bytecode cache is stale. Fix: `find django -type d -name __pycache__ -exec rm -r {} + 2>/dev/null && find django -name "*.pyc" -delete` then restart Django.

## Interview Constraints (Important for AI Suggestions)

- **No Django admin** - avoid suggesting it
- **No third-party packages** beyond skeleton dependencies
- **Hardcoded values acceptable** - no need for environment variables
- **No authentication/authorization** - out of scope
- **Speed over quality** - working > elegant for 45-min sprints

## Key Files to Reference

- `django/minicom/settings.py` - CORS/CSRF config
- `django/minicom/api.py` - Existing endpoint pattern to extend
- `foo-website/foo.js`, `bar-website/bar.js` - Frontend API contract
- `script/django/start` - Server startup (verify port 3000)
- `README.md` - Setup verification steps
