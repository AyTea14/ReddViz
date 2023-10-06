# ReddViz (Followed [D3vd/Meme_Api](https://github.com/D3vd/Meme_Api) code structures)

JSON API for a random posts scraped from reddit (image or gif only).

*See [Specify Subreddit](#specify-subreddit) if you want to use another subreddit*

API Link: [https://reddviz.ujol.dev/gimme](https://reddviz.ujol.dev/gimme)

**Example Response:**

```jsonc
{
    "id": "11upqnv",
    "title": "Sign me up",
    "subreddit": "Memes_Of_The_Dank",
    "author": "CopherBarry814",
    "postLink": "https://www.reddit.com/r/Memes_Of_The_Dank/comments/11upqnv/sign_me_up/",
    "thumbnail": "https://b.thumbs.redditmedia.com/FzZUKQLtF38NKzDZ5Z-XlMQS2h8CY6VnIMJBtvYr0bA.jpg",
    "image": "https://i.redd.it/h31i7oh3bioa1.jpg",
    "nsfw": false,
    "spoiler": false,
    "upvotes": 7343,
    "comments": 91,
    "createdUtc": 1679149183,
    "upvoteRatio": 0.97,
    "preview": {
        "images": [
            "https://preview.redd.it/h31i7oh3bioa1.jpg?width=108&crop=smart&auto=webp&s=742370c0d2b737de75004246b94dff383b265b02",
            "https://preview.redd.it/h31i7oh3bioa1.jpg?width=216&crop=smart&auto=webp&s=9f875ed650fbaef2265a4c070c23adc34335f898",
            "https://preview.redd.it/h31i7oh3bioa1.jpg?width=320&crop=smart&auto=webp&s=e80a6e1f1cfd6cd013dd26f0ea3a697837cb4b80",
            "https://preview.redd.it/h31i7oh3bioa1.jpg?width=640&crop=smart&auto=webp&s=61770500293c74d3d38e4c082df2b9360ac2839e",
            "https://preview.redd.it/h31i7oh3bioa1.jpg?auto=webp&s=ed64fe51a559f155c08e0efa031d22f30bea0a6e"
        ],
        "gifs": []
    }
}
```

## Custom Endpoints

### Specify count (MAX 50)

In order to get multiple posts in a single request specify the count with the following endpoint.

Endpoint: [/gimme?c={count}](https://reddviz.ujol.dev/gimme?c=2)

Example: [https://reddviz.ujol.dev/gimme?c=2](https://reddviz.ujol.dev/gimme?c=2)

Response:

```jsonc
{
    "count": 2,
    "posts": [
        {
            "id": "16y5ftq",
            "title": "I guess it has something to do with water",
            "subreddit": "Animemes",
            "author": "Koleksiyoncu_999999",
            "postLink": "https://www.reddit.com/r/Animemes/comments/16y5ftq/i_guess_it_has_something_to_do_with_water/",
            "thumbnail": "https://b.thumbs.redditmedia.com/Ka_cQG0IQViXxiBJ9FKcH3MEqKGQ-PN6p-jETJQAThA.jpg",
            "image": "https://i.redd.it/v8gypenl9urb1.jpg",
            "nsfw": false,
            "spoiler": false,
            "upvotes": 2888,
            "comments": 13,
            "createdUtc": 1696274035,
            "upvoteRatio": 1,
            "preview": {
                "images": [
                    "https://preview.redd.it/v8gypenl9urb1.jpg?width=108&crop=smart&auto=webp&s=c8ae614331974f83fae8095830a3279bcefe14fa",
                    "https://preview.redd.it/v8gypenl9urb1.jpg?width=216&crop=smart&auto=webp&s=f547e9290e4eb4000643bbbea910718d3c8bf4bd",
                    "https://preview.redd.it/v8gypenl9urb1.jpg?width=320&crop=smart&auto=webp&s=fbb7c6b138f505579dbf33c4ca040a1f73a6d572",
                    "https://preview.redd.it/v8gypenl9urb1.jpg?width=640&crop=smart&auto=webp&s=1429080d0075bcbea6d75c120479ddbeea906b30",
                    "https://preview.redd.it/v8gypenl9urb1.jpg?auto=webp&s=64308bcbac79f7fabc1e885d2b9f63156830cfd5"
                ],
                "gifs": []
            }
        },
        {
            "id": "16xeows",
            "title": "What? No way...",
            "subreddit": "Animemes",
            "author": "Holofan4life",
            "postLink": "https://www.reddit.com/r/Animemes/comments/16xeows/what_no_way/",
            "thumbnail": "https://b.thumbs.redditmedia.com/2UYEWxNS7y_Kl8whbZjKzaNdm0InivKk5NI-vCuqddA.jpg",
            "image": "https://i.redd.it/cvh7fqdz0orb1.jpg",
            "nsfw": false,
            "spoiler": false,
            "upvotes": 897,
            "comments": 14,
            "createdUtc": 1696198494,
            "upvoteRatio": 0.99,
            "preview": {
                "images": [
                    "https://preview.redd.it/cvh7fqdz0orb1.jpg?width=108&crop=smart&auto=webp&s=a96e9dfb5aa58fb0700f108802ba04b64301590b",
                    "https://preview.redd.it/cvh7fqdz0orb1.jpg?width=216&crop=smart&auto=webp&s=bf6472668beee92fab9133c00ba5f0b3eaec6614",
                    "https://preview.redd.it/cvh7fqdz0orb1.jpg?width=320&crop=smart&auto=webp&s=cc038f751b1f558444025702cc643032cace315c",
                    "https://preview.redd.it/cvh7fqdz0orb1.jpg?width=640&crop=smart&auto=webp&s=bdd6c8c6afe0dce01930ab1357c56a5b20101c89",
                    "https://preview.redd.it/cvh7fqdz0orb1.jpg?auto=webp&s=87a765d62de68cf4e15599755d195e3e58f0d6ee"
                ],
                "gifs": []
            }
        }
    ]
}
```

### Specify Subreddit

By default the API grabs a random post from this subreddits [list](src/utils/constants.ts). To provide your own custom subreddit use the following endpoint.

Endpoint: [/gimme/{subreddit}](https://reddviz.ujol.dev/gimme/animemes)

Example: [https://reddviz.ujol.dev/gimme/animemes](https://reddviz.ujol.dev/gimme/animemes)

Response:

```json
{
    "id": "16uopbe",
    "title": "It’s immeasurable",
    "subreddit": "Animemes",
    "author": "Rail_House_Jam",
    "postLink": "https://www.reddit.com/r/Animemes/comments/16uopbe/its_immeasurable/",
    "thumbnail": "https://b.thumbs.redditmedia.com/Gf9CAuzvQv4C3hLwvqN2ntaZCFr7_aXkzvsqoulVa-k.jpg",
    "image": "https://i.redd.it/abkntjnup1rb1.jpg",
    "nsfw": false,
    "spoiler": false,
    "upvotes": 3189,
    "comments": 62,
    "createdUtc": 1695928404,
    "upvoteRatio": 0.98,
    "preview": {
        "images": [
            "https://preview.redd.it/abkntjnup1rb1.jpg?width=108&crop=smart&auto=webp&s=6f59dc8981fc3c3d7167f65bb28b3e8b22dd85a1",
            "https://preview.redd.it/abkntjnup1rb1.jpg?width=216&crop=smart&auto=webp&s=497245488455f43e2633d22437410dd2b041cf5b",
            "https://preview.redd.it/abkntjnup1rb1.jpg?width=320&crop=smart&auto=webp&s=cac38fb075fa0882eadf166f812e91d4de01e6a2",
            "https://preview.redd.it/abkntjnup1rb1.jpg?width=640&crop=smart&auto=webp&s=5ccd7c315601cfdc823ddd51e7721dd23afb840b",
            "https://preview.redd.it/abkntjnup1rb1.jpg?width=960&crop=smart&auto=webp&s=5f2c9068efdde84656dd74070376ddfedbafdd71",
            "https://preview.redd.it/abkntjnup1rb1.jpg?width=1080&crop=smart&auto=webp&s=2c160137b914dd498ac6260f54a7a224a6109952",
            "https://preview.redd.it/abkntjnup1rb1.jpg?auto=webp&s=a19b3afa71575bc31524de457113e83cb74e957d"
        ],
        "gifs": []
    }
}
```

### Specify Subreddit Count (MAX 50)

In order to get a custom number of posts from a specific subreddit provide the name of the subreddit and the count in the following endpoint.

Endpoint: [/gimme/{subreddit}?c={count}](https://reddviz.ujol.dev/gimme/animemes?c=2)

Example: [https://reddviz.ujol.dev/gimme/animemes?c=2](https://reddviz.ujol.dev/gimme/animemes?c=2)

Response:

```json
{
    "count": 2,
    "posts": [
        {
            "id": "1708p2m",
            "title": "Anime: Age, what's that ?",
            "subreddit": "Animemes",
            "author": "skj_subith_2903",
            "postLink": "https://www.reddit.com/r/Animemes/comments/1708p2m/anime_age_whats_that/",
            "thumbnail": "https://b.thumbs.redditmedia.com/WXKagxA9_j44nkwW6-7BEeVk50--aaj9OnpvUC2nRaQ.jpg",
            "image": "https://i.redd.it/2yamztzjabsb1.jpg",
            "nsfw": false,
            "spoiler": false,
            "upvotes": 1242,
            "comments": 60,
            "createdUtc": 1696480176,
            "upvoteRatio": 0.97,
            "preview": {
                "images": [
                    "https://preview.redd.it/2yamztzjabsb1.jpg?width=108&crop=smart&auto=webp&s=badadc7824c8994401b5839329a94767111de7d8",
                    "https://preview.redd.it/2yamztzjabsb1.jpg?width=216&crop=smart&auto=webp&s=0871b41e09fcfae0d7c9bfe87414cf9a5bbb3648",
                    "https://preview.redd.it/2yamztzjabsb1.jpg?width=320&crop=smart&auto=webp&s=e98f4d971d61eb30d85b45c9c61f7eb74febfbfb",
                    "https://preview.redd.it/2yamztzjabsb1.jpg?width=640&crop=smart&auto=webp&s=f2732324d6b3327ee856f410620b4ab255114df0",
                    "https://preview.redd.it/2yamztzjabsb1.jpg?auto=webp&s=3b37c7adaf3cc4d7714dfce2736d608eca24e6d7"
                ],
                "gifs": []
            }
        },
        {
            "id": "16vbrpn",
            "title": "You're not only cheating the game, you're cheating yourself",
            "subreddit": "Animemes",
            "author": "MNicolas97",
            "postLink": "https://www.reddit.com/r/Animemes/comments/16vbrpn/youre_not_only_cheating_the_game_youre_cheating/",
            "thumbnail": "https://a.thumbs.redditmedia.com/ptMz2Ql3kLrTAAyvtihpnE3Gs8MXy0guzP7PgX1CEy0.jpg",
            "image": "https://i.redd.it/ecocm2nv57rb1.jpg",
            "nsfw": false,
            "spoiler": false,
            "upvotes": 441,
            "comments": 15,
            "createdUtc": 1695994325,
            "upvoteRatio": 0.97,
            "preview": {
                "images": [
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?width=108&crop=smart&auto=webp&s=f37e359025ef11260b6ce2e1f68cc8b9c740fe95",
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?width=216&crop=smart&auto=webp&s=17c9493057e78a2b3c3a11346f48ef38543a4d18",
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?width=320&crop=smart&auto=webp&s=79ad188d356c87b8cf9b09c6a756d3f02498870c",
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?width=640&crop=smart&auto=webp&s=375e4ef9046e8ed3ffc56a6bfecd867938d6bd21",
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?width=960&crop=smart&auto=webp&s=9b2010a8559d11d8700ea6eb35ead8346d8c25e0",
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?width=1080&crop=smart&auto=webp&s=7d5c09daba9a842c203c45b18a305210952f43ea",
                    "https://preview.redd.it/ecocm2nv57rb1.jpg?auto=webp&s=4dda77d73b8ef45637670013e35a63f26178151e"
                ],
                "gifs": []
            }
        }
    ]
}
```
