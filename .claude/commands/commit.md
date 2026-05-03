# /commit — Conventional Commit Message Generator

Энэ өөрчлөлтөд тохирсон commit message үүсгэ.

## Conventional Commits формат

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Type-үүд
| Type | Хэзээ ашиглах |
|------|---------------|
| `feat` | Шинэ feature нэмсэн |
| `fix` | Bug зассан |
| `docs` | Зөвхөн баримтжуулалт өөрчилсөн |
| `test` | Тест нэмсэн/зассан |
| `refactor` | Код бүтцийг өөрчилсөн (feature/bug биш) |
| `chore` | Build, config, dependency өөрчлөлт |
| `style` | Formatting, semicolon гэх мэт (logic биш) |

## Scope-үүд (энэ проектод)
- `books`, `members`, `loans`, `dashboard`
- `db`, `middleware`, `routes`, `repo`
- `tests`, `config`, `deps`

## AI ашигласан бол заавал нэмэх
```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Жишээ

```
feat(loans): add transaction wrapper for checkout and return

Use better-sqlite3 transaction to ensure book available_copies
stays consistent when loan creation fails midway.

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
fix(books): prevent delete when active loans exist

Returns 409 Conflict instead of allowing DELETE that would 
violate loan history integrity.
```

## Шаардлага
- Description ≤72 тэмдэгт
- Одоогийн цагийн үйл үг ашиглах (Add, Fix, Update — биш Added, Fixed)
- Яагаад өөрчилсөнийг body-д тайлбарлах