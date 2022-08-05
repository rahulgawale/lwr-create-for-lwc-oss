exports.template = `{{=[[ ]]=}}<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>[[pageTitle]]</title>
        <link rel="stylesheet" href="$assetsDir/css/main.css" />
    </head>

    <body>
        <div class="wrapper">
            <header>
                <svg class="logo" viewBox="0 0 64 64">
                    <path fill="#00a1e0" d="M23 6h22l-8 18h11L20 58l6-26H16l7-26z"></path>
                    <path
                        fill="#032e61"
                        d="M20 60a2 2 0 0 1-1.95-2.45L23.5 34H16a2 2 0 0 1-1.93-2.52l7-26A2 2 0 0 1 23 4h22a2 2 0 0 1 1.83 2.81L40.08 22H48a2 2 0 0 1 1.54 3.27l-28 34A2 2 0 0 1 20 60zm-1.4-30H26a2 2 0 0 1 1.95 2.45l-4.1 17.72L43.76 26H37a2 2 0 0 1-1.83-2.81L41.92 8h-17.4z"></path>
                    <path
                        fill="#fff"
                        d="M26 26a2 2 0 0 1-1.93-2.53l3-11a2 2 0 1 1 3.86 1.05l-3 11A2 2 0 0 1 26 26z"></path>
                </svg>
            </header>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/explore">Explore</a></li>
                    <li>
                        <a href="//developer.salesforce.com/docs/platform/lwr/overview">
                            Learn LWR
                        </a>
                    </li>
                </ul>
            </nav>
            <main>{{ body | safe }}</main>
        </div>
    </body>
</html>`;
