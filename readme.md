# Translatron

Use different languages directly in your `<html>` code and let translatron make the versions for each language.

Specify the available languages in the `<html>` tags `lang` attribute. use the `l` attribute to mark a tag as specific for this language.

## Example

```html
<html lang="en,de">
	<head>
		<title l="en">The Title</title>
		<title l="de">Der Titel</title>
	</head>
	<body>
		<p>
			<lang l="en">English content</lang>
			<lang l="de">Deutscher Inhalt</lang>
		</p>
	</body>
</html>
```

`translatron -l de -l en test.html test.*.html`

This will generate the files `test.de.html` and `test.en.html` containing

```html
<html lang="en">
	<head>
		<title>The Title</title>
	</head>
	<body>
		<p>
			English content
		</p>
	</body>
</html>
```
and 

```html
<html lang="de">
	<head>
		<title>Der Titel</title>
	</head>
	<body>
		<p>
			Deutscher Inhalt
		</p>
	</body>
</html>
```

