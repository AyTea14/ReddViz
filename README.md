# Meme API (Inspired by [D3vd](https://github.com/D3vd/Meme_Api) but written in TypeScript)

JSON API for a random meme scraped from reddit (image only).

API Link: [https://memeapi.ujol.dev/gimme](https://memeapi.ujol.dev/gimme)

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

Endpoint: [/gimme/{count}](https://memeapi.ujol.dev/gimme/2)

Example: [https://memeapi.ujol.dev/gimme/2](https://memeapi.ujol.dev/gimme/2)

Response:

```jsonc
{
   "count": 2,
   "memes": [
      {
         "id": "zv0p4c",
         "title": "I have lived ten of your lifetimes, boy",
         "subreddit": "dankmemes",
         "author": "Cell_Medium",
         "postLink": "https://www.reddit.com/r/dankmemes/comments/zv0p4c/i_have_lived_ten_of_your_lifetimes_boy/",
         "thumbnail": "https://b.thumbs.redditmedia.com/gW02xffe6djEJtKfip-RgQ5qlH0zqx0tLe8WYK7dQws.jpg",
         "image": "https://i.redd.it/tgeb0i4sy38a1.jpg",
         "nsfw": false,
         "spoiler": false,
         "upvotes": 222,
         "comments": 11,
         "createdUtc": 1671983992,
         "upvoteRatio": 0.92,
         "preview": [
            "https://preview.redd.it/tgeb0i4sy38a1.jpg?width=108&crop=smart&auto=webp&s=ac187090f26b9d6e0e2fcfd45cd9e4501b11a755",
            "https://preview.redd.it/tgeb0i4sy38a1.jpg?width=216&crop=smart&auto=webp&s=2304731b86d0e8c29cb640af2eeefa30639325ae",
            "https://preview.redd.it/tgeb0i4sy38a1.jpg?width=320&crop=smart&auto=webp&s=800e1cc9dd70396772d6a4c4c93322b3268a97a2",
            "https://preview.redd.it/tgeb0i4sy38a1.jpg?width=640&crop=smart&auto=webp&s=86d9292085e3d5639c14a687d2a79b76a77b56e1",
            "https://preview.redd.it/tgeb0i4sy38a1.jpg?auto=webp&s=598d765b768dcab81e182a4e2b89067e0ba07d18"
         ]
      },
      {
         "id": "zvm1cp",
         "title": "Offers “shoulder” to cry on",
         "subreddit": "dankmemes",
         "author": "RegularNoodles",
         "postLink": "https://www.reddit.com/r/dankmemes/comments/zvm1cp/offers_shoulder_to_cry_on/",
         "thumbnail": "https://b.thumbs.redditmedia.com/GNR7cehWAS5u1we-Em1-aMelBvrUpUNnLNW35WA0XMs.jpg",
         "image": "https://i.redd.it/nb0t25t60a8a1.gif",
         "nsfw": false,
         "spoiler": false,
         "upvotes": 144,
         "comments": 4,
         "createdUtc": 1672057119,
         "upvoteRatio": 0.98,
         "preview": [
            "https://preview.redd.it/nb0t25t60a8a1.gif?width=108&crop=smart&format=png8&s=b001b5820e4166ad7bf163e7948ccabf8e6d2bfa",
            "https://preview.redd.it/nb0t25t60a8a1.gif?width=216&crop=smart&format=png8&s=a5bb3fef81e3723941da607f5ec397171d0d877f",
            "https://preview.redd.it/nb0t25t60a8a1.gif?width=320&crop=smart&format=png8&s=35663864554a56c715b397042d266a49cca79b2b",
            "https://preview.redd.it/nb0t25t60a8a1.gif?format=png8&s=4b14c6b4749cae05051c311259bc4da5c7e4673e"
         ]
      }
   ]
}
```

### Specify Subreddit

By default the API grabs a random meme from this subreddits [list](src/utils/subreddits.js). To provide your own custom subreddit use the following endpoint.

Endpoint: [/gimme/{subreddit}](https://memeapi.ujol.dev/gimme/animemes)

Example: [https://memeapi.ujol.dev/gimme/animemes](https://memeapi.ujol.dev/gimme/animemes)

Response:

```json
{
   "id": "zf888a",
   "title": "Who thought it was a good idea to censor blood in... white?",
   "subreddit": "Animemes",
   "author": "Lorette_Lorena",
   "postLink": "https://www.reddit.com/r/Animemes/comments/zf888a/who_thought_it_was_a_good_idea_to_censor_blood_in/",
   "thumbnail": "https://a.thumbs.redditmedia.com/Cz24XQINRREiYENtvxN0fD0DgvmNgeQuoAsXI0iD1X4.jpg",
   "image": "https://i.redd.it/gvxf4tfnli4a1.jpg",
   "nsfw": false,
   "spoiler": false,
   "upvotes": 6486,
   "comments": 201,
   "createdUtc": 1670435788,
   "upvoteRatio": 0.96,
   "preview": [
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?width=108&crop=smart&auto=webp&s=c2ba344656d41edfd94473a34cacfef46f792b60",
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?width=216&crop=smart&auto=webp&s=0c52cfbdc47cb37bcb1716c97def361200faade7",
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?width=320&crop=smart&auto=webp&s=9fd0df93a15fb393d9d07fc5dc92723b9bab16d9",
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?width=640&crop=smart&auto=webp&s=066a67a85b86e58b73747f3d61e2317da543d80a",
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?width=960&crop=smart&auto=webp&s=8e4b8bca470626bb9d729a4e0e5f7af48f450851",
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?width=1080&crop=smart&auto=webp&s=c46d36ebc623c7b11202337fda43b88cc2ba4d9d",
      "https://preview.redd.it/gvxf4tfnli4a1.jpg?auto=webp&s=e9f40e84ac08797ec8216b39fe11583930082f7f"
   ]
}
```

### Specify Subreddit Count (MAX 50)

In order to get a custom number of memes from a specific subreddit provide the name of the subreddit and the count in the following endpoint.

Endpoint: [/gimme/{subreddit}/{count}](https://memeapi.ujol.dev/gimme/animemes/2)

Example: [https://memeapi.ujol.dev/gimme/animemes/2](https://memeapi.ujol.dev/gimme/animemes/2)

Response:

```json
{
   "count": 2,
   "memes": [
      {
         "id": "zea6vo",
         "title": "I double dare you MF",
         "subreddit": "Animemes",
         "author": "Fulltime_Introvert",
         "postLink": "https://www.reddit.com/r/Animemes/comments/zea6vo/i_double_dare_you_mf/",
         "thumbnail": "https://b.thumbs.redditmedia.com/xmDaTYVSobl6vD1MDT_xBG1OPAIRdMK6GCc7NKNaRKw.jpg",
         "image": "https://i.redd.it/6fgp9962va4a1.jpg",
         "nsfw": false,
         "spoiler": false,
         "upvotes": 6992,
         "comments": 149,
         "createdUtc": 1670342088,
         "upvoteRatio": 0.98,
         "preview": [
            "https://preview.redd.it/6fgp9962va4a1.jpg?width=108&crop=smart&auto=webp&s=0515d0089d4f699f8121cfb85b9d656440897cac",
            "https://preview.redd.it/6fgp9962va4a1.jpg?width=216&crop=smart&auto=webp&s=efed82771889ba9a3ca13ef45e064ba8182ba938",
            "https://preview.redd.it/6fgp9962va4a1.jpg?width=320&crop=smart&auto=webp&s=0ba2d907bad6a822394ac0b431816385503c26b6",
            "https://preview.redd.it/6fgp9962va4a1.jpg?width=640&crop=smart&auto=webp&s=96e49668e759e884b0ae5a5c1c6e58db281d59b0",
            "https://preview.redd.it/6fgp9962va4a1.jpg?width=960&crop=smart&auto=webp&s=ec669977be1ea66de673302363ab9952f84a5202",
            "https://preview.redd.it/6fgp9962va4a1.jpg?width=1080&crop=smart&auto=webp&s=7dbceea0fb69e8e392ec2b391a7a018a92ce8070",
            "https://preview.redd.it/6fgp9962va4a1.jpg?auto=webp&s=961ef1678a5bfe614caf32a89af48e94955d30af"
         ]
      },
      {
         "id": "zuavgl",
         "title": "You can't escape the pain",
         "subreddit": "Animemes",
         "author": "GABESTFY",
         "postLink": "https://www.reddit.com/r/Animemes/comments/zuavgl/you_cant_escape_the_pain/",
         "thumbnail": "https://b.thumbs.redditmedia.com/IoRpNwryhTadS64jkUlhMIAOdH95Ts2j6FuHRO_h3uU.jpg",
         "image": "https://i.redd.it/6jiwc1itvu7a1.jpg",
         "nsfw": false,
         "spoiler": false,
         "upvotes": 12484,
         "comments": 149,
         "createdUtc": 1671892022,
         "upvoteRatio": 0.97,
         "preview": [
            "https://preview.redd.it/6jiwc1itvu7a1.jpg?width=108&crop=smart&auto=webp&s=37de438e940dbaf301edf8c321ac2ec1c81f7cb1",
            "https://preview.redd.it/6jiwc1itvu7a1.jpg?width=216&crop=smart&auto=webp&s=5c93efd723a64f670831f1fb3927c23ca24c6b02",
            "https://preview.redd.it/6jiwc1itvu7a1.jpg?width=320&crop=smart&auto=webp&s=36f023fe6aed0685bd1d157685ac94089c3696d3",
            "https://preview.redd.it/6jiwc1itvu7a1.jpg?width=640&crop=smart&auto=webp&s=cd0d6fe8a81369fbaf87c35b8e53af092beef85e",
            "https://preview.redd.it/6jiwc1itvu7a1.jpg?width=960&crop=smart&auto=webp&s=655b4d628a9c2e6754f344a91697cc9d0472abdb",
            "https://preview.redd.it/6jiwc1itvu7a1.jpg?auto=webp&s=2760e4b09479978baa8f94f75a9acf246c43fae8"
         ]
      }
   ]
}
```
