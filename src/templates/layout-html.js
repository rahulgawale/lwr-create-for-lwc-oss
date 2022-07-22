exports.template = `<!-- my-app/src/layouts/main.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{{pageTitle}}</title>
        <link rel="stylesheet" href="$assetsDir/styles/salesforce-lightning-design-system.css" />
    </head>
    <body>
        {{=[[ ]]=}}
        {{{body}}} {{{lwr_resources}}}
    </body>
</html>`;
