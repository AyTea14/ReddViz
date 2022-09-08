# Meme API (Inspired by [D3vd](https://github.com/D3vd/Meme_Api) but written in TypeScript)

JSON API for a random meme scraped from reddit (image only).

API Link: [https://memeapi.cyclic.app/gimme](https://memeapi.cyclic.app/gimme)

**Example Response:**

```jsonc
{
    "id": "v446ic",
    "title": "Let the good times roll",
    "subreddit": "wholesomememes",
    "author": "faroll2",
    "postLink": "https://www.reddit.com/r/wholesomememes/comments/v446ic/let_the_good_times_roll/",
    "thumbnail": "https://b.thumbs.redditmedia.com/DmkrEy1oEsXGJDI19nEKsibw8Oy8jC27Ys83Kple-AQ.jpg",
    "image": "https://i.redd.it/oc6o118yvf391.gif",
    "nsfw": false,
    "spoiler": false,
    "upvotes": 413,
    "comments": 8,
    "createdUtc": 1654276538,
    "upvoteRatio": 0.98,
    "preview": [
        "https://preview.redd.it/oc6o118yvf391.gif?width=108&crop=smart&format=png8&s=77ae6046e6a64aee6f91fe1733c4ccfbaaae1e59",
        "https://preview.redd.it/oc6o118yvf391.gif?width=216&crop=smart&format=png8&s=4d98a6e1aaca802277680e90cc2fc92f5554335b",
        "https://preview.redd.it/oc6o118yvf391.gif?width=320&crop=smart&format=png8&s=05201b164498027daba6ca95d0e02b4936c194ed"
    ]
}
```

## Custom Endpoints

### Specify count (MAX 50)

In order to get multiple memes in a single request specify the count with the following endpoint.

Endpoint: [/gimme/{count}](https://memeapi.cyclic.app/gimme/2)

Example: [https://memeapi.cyclic.app/gimme/2](https://memeapi.cyclic.app/gimme/2)

Response:

```jsonc
{
    "count": 2,
    "memes": [
        {
            "id": "v4dc5o",
            "title": "LOVE this so so much",
            "subreddit": "wholesomememes",
            "author": "junieteajones",
            "postLink": "https://www.reddit.com/r/wholesomememes/comments/v4dc5o/love_this_so_so_much/",
            "thumbnail": "https://b.thumbs.redditmedia.com/jwpfftE0b5qSoaYvHpkzPEQaTV9QQ5DUCSAPIw0PiNo.jpg",
            "image": "https://i.imgur.com/aB2kV8a.png",
            "nsfw": false,
            "spoiler": false,
            "upvotes": 108,
            "comments": 6,
            "createdUtc": 1654303649,
            "upvoteRatio": 0.97,
            "preview": [
                "https://external-preview.redd.it/53YZJV5XLAlhv9I4fHYlk5w62XNQXACV5_sC2oCPo7A.png?width=108&crop=smart&auto=webp&s=1ac3aabf10a159fe4851b38e0915f6ccc5143a14",
                "https://external-preview.redd.it/53YZJV5XLAlhv9I4fHYlk5w62XNQXACV5_sC2oCPo7A.png?width=216&crop=smart&auto=webp&s=366728532d04c4a004af3fe5512334d61e0ee55d",
                "https://external-preview.redd.it/53YZJV5XLAlhv9I4fHYlk5w62XNQXACV5_sC2oCPo7A.png?width=320&crop=smart&auto=webp&s=475055204870ee0598c35542aabedc6c89d7dd4c",
                "https://external-preview.redd.it/53YZJV5XLAlhv9I4fHYlk5w62XNQXACV5_sC2oCPo7A.png?width=640&crop=smart&auto=webp&s=48ee0fc5b3f0df4db599b4fbab959980d8fd4915",
                "https://external-preview.redd.it/53YZJV5XLAlhv9I4fHYlk5w62XNQXACV5_sC2oCPo7A.png?width=960&crop=smart&auto=webp&s=94cd669f4ac1782df8924c8b892ebd84295b70e9"
            ]
        },
        {
            "id": "v46jv5",
            "title": "Will always accept the offer.",
            "subreddit": "wholesomememes",
            "author": "cjconair",
            "postLink": "https://www.reddit.com/r/wholesomememes/comments/v46jv5/will_always_accept_the_offer/",
            "thumbnail": "https://b.thumbs.redditmedia.com/MtBjbKdPxRAh6xb-XoDPhw6L2SQkP-bC10GXqtzXXOk.jpg",
            "image": "https://i.redd.it/qej0api6gg391.gif",
            "nsfw": false,
            "spoiler": false,
            "upvotes": 177,
            "comments": 5,
            "createdUtc": 1654283338,
            "upvoteRatio": 0.98,
            "preview": [
                "https://preview.redd.it/qej0api6gg391.gif?width=108&crop=smart&format=png8&s=97adf247e656ff2aa86bab607055f4749dc41964",
                "https://preview.redd.it/qej0api6gg391.gif?width=216&crop=smart&format=png8&s=d95c88bf0d3fc99b9d04520fc4fa6077d17fe01f",
                "https://preview.redd.it/qej0api6gg391.gif?width=320&crop=smart&format=png8&s=a71a4a7956306d79185141275b7ea40b29da32bf"
            ]
        }
    ]
}
```

### Specify Subreddit

By default the API grabs a random meme from this subreddits [list](src/utils/subreddits.js). To provide your own custom subreddit use the following endpoint.

Endpoint: [/gimme/{subreddit}](https://memeapi.cyclic.app/gimme/animemes)

Example: [https://memeapi.cyclic.app/gimme/animemes](https://memeapi.cyclic.app/gimme/animemes)

Response:

```json
{
    "id": "hveghl",
    "title": "Madara kinda op :/",
    "subreddit": "Animemes",
    "author": "Blastingassassin",
    "postLink": "https://www.reddit.com/r/Animemes/comments/hveghl/madara_kinda_op/",
    "thumbnail": "https://b.thumbs.redditmedia.com/BzuaEcN_wEvgMpRrUblfuvyVHVSrxNExzocpm-X5FqQ.jpg",
    "image": "https://i.redd.it/9ghna9vzl9c51.gif",
    "nsfw": false,
    "spoiler": false,
    "createdUtc": 1595361135,
    "upvotes": 33938,
    "comments": 207,
    "upvoteRatio": 0.99,
    "preview": [
        "https://preview.redd.it/9ghna9vzl9c51.gif?width=108&crop=smart&format=png8&s=55f1c636904c38aadb7fa9e435d26390c457e747",
        "https://preview.redd.it/9ghna9vzl9c51.gif?width=216&crop=smart&format=png8&s=2fb54ca389c04d90b09775bfc3f2662a569a889a",
        "https://preview.redd.it/9ghna9vzl9c51.gif?width=320&crop=smart&format=png8&s=8d2048566e9b7d6c7059dfa39f4c2115f7ec7c0a",
        "https://preview.redd.it/9ghna9vzl9c51.gif?width=640&crop=smart&format=png8&s=5809e1aa52a4d793476be3cdd4d06ac95a0eed69",
        "https://preview.redd.it/9ghna9vzl9c51.gif?width=960&crop=smart&format=png8&s=753a3b69b78bfa0694a4b92627bdfdec2b8eb7a1",
        "https://preview.redd.it/9ghna9vzl9c51.gif?width=1080&crop=smart&format=png8&s=f6d455cae1424fc8f3f9b4831d62866f7452eff5",
        "https://preview.redd.it/9ghna9vzl9c51.gif?format=png8&s=f665bf58badbf89c8f5d8f336f0194744fecb89d"
    ]
}
```

### Specify Subreddit Count (MAX 50)

In order to get a custom number of memes from a specific subreddit provide the name of the subreddit and the count in the following endpoint.

Endpoint: [/gimme/{subreddit}/{count}](https://memeapi.cyclic.app/gimme/animemes/2)

Example: [https://memeapi.cyclic.app/gimme/animemes/2](https://memeapi.cyclic.app/gimme/animemes/2)

Response:

```json
{
    "count": 2,
    "memes": [
        {
            "id": "fdwfbw",
            "title": "\"I'M AN ADULT NOW, NAOFUMI!\"",
            "subreddit": "Animemes",
            "author": "Venyes",
            "postLink": "https://www.reddit.com/r/Animemes/comments/fdwfbw/im_an_adult_now_naofumi/",
            "thumbnail": "https://b.thumbs.redditmedia.com/diUEmzjZBFYg0xnrezc7VwmFm_xSfBC7Oe1NewZeO-k.jpg",
            "image": "https://i.redd.it/nue1vpp6cvk41.png",
            "nsfw": false,
            "spoiler": false,
            "createdUtc": 1583420379,
            "upvotes": 37772,
            "comments": 310,
            "upvoteRatio": 0.99,
            "preview": [
                "https://preview.redd.it/nue1vpp6cvk41.png?width=108&crop=smart&auto=webp&s=047daf1c976dd06a43baaa1a9106cb5f5a39dbb4",
                "https://preview.redd.it/nue1vpp6cvk41.png?width=216&crop=smart&auto=webp&s=03ac1b19b3685b8d3a63c9ebb8fee3e3d28331f5",
                "https://preview.redd.it/nue1vpp6cvk41.png?width=320&crop=smart&auto=webp&s=75e3d6c204e6b4949d1cf7854871b26b39fd0e0c",
                "https://preview.redd.it/nue1vpp6cvk41.png?width=640&crop=smart&auto=webp&s=d3d780c3b34ea54b6f93b19899b53bfc40930141",
                "https://preview.redd.it/nue1vpp6cvk41.png?width=960&crop=smart&auto=webp&s=c3afc58a67038726c31226c5fac112a109481943",
                "https://preview.redd.it/nue1vpp6cvk41.png?width=1080&crop=smart&auto=webp&s=df2f089a1b449de6367f5ed3c3d9197b8208192b",
                "https://preview.redd.it/nue1vpp6cvk41.png?auto=webp&s=895fb6b825cdbe0230c72ab510d9080d25d5b945"
            ]
        },
        {
            "id": "gb0fvy",
            "title": "Sauce is Uzumaki",
            "subreddit": "Animemes",
            "author": "Fandayo",
            "postLink": "https://www.reddit.com/r/Animemes/comments/gb0fvy/sauce_is_uzumaki/",
            "thumbnail": "https://a.thumbs.redditmedia.com/9vcDxUJ9sxeeBlbM3--PZTNU0pOgz1WHqLJ5KtA7KR0.jpg",
            "image": "https://i.redd.it/54jphrtoszv41.jpg",
            "nsfw": false,
            "spoiler": false,
            "createdUtc": 1588268674,
            "upvotes": 41180,
            "comments": 255,
            "upvoteRatio": 1,
            "preview": [
                "https://preview.redd.it/54jphrtoszv41.jpg?width=108&crop=smart&auto=webp&s=482e49650b46ec92c2599e39307e2d9295a3da96",
                "https://preview.redd.it/54jphrtoszv41.jpg?width=216&crop=smart&auto=webp&s=953121cef454af222731a4b2d71521504eade6dc",
                "https://preview.redd.it/54jphrtoszv41.jpg?width=320&crop=smart&auto=webp&s=614f28a3da7eefd3738bbcef6839adc4206ebc0b",
                "https://preview.redd.it/54jphrtoszv41.jpg?width=640&crop=smart&auto=webp&s=1565f713c4aaf6807957e92f0a3c67df2f3a0049",
                "https://preview.redd.it/54jphrtoszv41.jpg?width=960&crop=smart&auto=webp&s=a522dcb880eb709ee3e6c3916bb44b511045de9e",
                "https://preview.redd.it/54jphrtoszv41.jpg?width=1080&crop=smart&auto=webp&s=379b3cf5bd5a7b15620f6ccd533111915134ecea",
                "https://preview.redd.it/54jphrtoszv41.jpg?auto=webp&s=fd48b18a044dbf99c4d459b74bbb057e887bdf3c"
            ]
        }
    ]
}
```
