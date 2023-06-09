## Individuell del - Nodejs

### Login & Signup

Vid inlogg så får man en JWT tillbaka som sedan måste skickas med i headers under Authorization vid alla admin requests. Giltig 1 timme.
Vid skapande av nytt konto så får man role: user som standard.
bcrypt används för kryptering av lösenord.

URL: http://localhost:5000/api/user/login
URL: http://localhost:5000/api/user/signup

Adminkonton nedan kan användas för att att logga in med och få en JWT för att komma åt admin endpointsen.

```
{
  "username": "Testadmin",
  "password": "12345678"
}
```

### Lägg till produkt i menyn

ID genereras per automatik av nedb, så skickas med in i body. Ok av Maja. Middleware kontrollerar så att title, desc och price finns med. Samt att det inte finns någon produkt med samma title.

URL: http://localhost:5000/api/admin/menu/add

```
{
  "title": "Ny produkt",
  "desc": "Finaste produkten av dom alla",
  "price": 45,
}
```

### Ändra produkt i menyn

Produkt ID hämtas från url. Middleware kollar så att produkt finns.
Skicka endast in det som ska ändras i body.

Produkt ID för test: YQjvjl96z4xKLVV6

URL: http://localhost:5000/api/admin/menu/modify/{productId}

```
{
  "title":"Uppdaterad produkt"
}
```

### Ta bort produkt från menyn

URL: http://localhost:5000/api/admin/menu/remove/{productID}

Produkt ID för test: YQjvjl96z4xKLVV6

```
Behövs ingen body. ID hämtas från URL.
```

### Lägg till kampanj

Kampanjer läggs till i en egen databas. Middleware validerar att produkterna finns i menu databasen.

URL: http://localhost:5000/api/admin/campaign

```
{
	"products": [
		"Env7zeTHBxyW7W1z",
		"XOgx0eJtJHYnBpzt"
	],
	"price": 50
}
```
