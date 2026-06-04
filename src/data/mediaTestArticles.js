export const RAW_MEDIA_TEST_ARTICLES = [
  {
    id: "raw-1",
    title: "LiveLaw video format",
    source: "LiveLaw",
    enclosure: {
      type: "video/mp4",
      url: "https://www.youtube.com/embed/jenLHbYP3Is",
    },
    "content:encoded": `
      <figure>
        <img src="https://www.livelaw.in/h-upload/videothumb/yt_full_jenLHbYP3Is.jpg"/>
      </figure>
    `,
  },

  {
    id: "raw-2",
    title: "LiveLaw image enclosure format",
    source: "LiveLaw",
    enclosure: {
      type: "image/jpeg",
      url: "https://www.livelaw.in/h-upload/2026/02/05/654186-justice-l-victoria-gowri-madurai-bench-madras-high-court.webp",
    },
    "content:encoded": `
      <figure>
        <img src="https://www.livelaw.in/h-upload/2026/02/05/654186-justice-l-victoria-gowri-madurai-bench-madras-high-court.webp"/>
      </figure>
    `,
  },

  {
    id: "raw-3",
    title: "LawBeat image tag format",
    source: "LawBeat",
    image: "https://lawbeat.in/h-upload/2026/06/03/2191525-aravalli-scjpg.webp",
    imagecaption:
      "Supreme Court appointed 5-member expert committee to define Aravalli Range by August 31.",
    "content:encoded": `
      <img src="https://lawbeat.in/h-upload/2026/06/03/2191525-aravalli-scjpg.webp" />
    `,
  },

  {
    id: "raw-4",
    title: "ET LegalWorld media:content format",
    source: "ET LegalWorld",
    "media:content": {
      medium: "image",
      url: "https://etimg.etb2bimg.com/thumb/img-size-84062/131480048.cms",
      width: 1200,
      height: 900,
    },
  },

  {
    id: "raw-5",
    title: "Bar & Bench media content + thumbnail format",
    source: "Bar & Bench",
    "media:content": {
      url: "https://cf-images.assettype.com/barandbench/2026-06-03/xs79m4on/145783.png",
      width: 1600,
      height: 900,
      "media:title":
        "Justice Harmeet Singh Grewal and Justice Deepinder Singh Nalwa",
    },
    "media:thumbnail": {
      url: "https://cf-images.assettype.com/barandbench/2026-06-03/xs79m4on/145783.png?w=280",
      width: 280,
    },
  },

  {
    id: "raw-6",
    title: "Multiple inline images format",
    source: "Bar & Bench",
    "content:encoded": `
      <figure>
        <img src="https://cf-images.assettype.com/barandbench/2025-08-14/c4hzxg2f/ViewPoint-MIddle-Single-Image-copy.jpg" />
        <figcaption>Senior Advocate Prashanto Chandra Sen</figcaption>
      </figure>
      <figure>
        <img src="https://cf-images.assettype.com/barandbench/2026-06-02/l0ertsea/Senior-Advocate-Haripriya-Padmanabhan.jpeg" />
        <figcaption>Senior Advocate Haripriya Padmanabhan</figcaption>
      </figure>
    `,
  },

  {
    id: "raw-7",
    title: "Embedded YouTube iframe format",
    source: "LiveLaw",
    "content:encoded": `
      <iframe src="//www.youtube.com/embed/jenLHbYP3Is"></iframe>
    `,
  },

  {
    id: "raw-8",
    title: "GIF inside content format",
    source: "Test Source",
    "content:encoded": `
      <img src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" />
    `,
  },

  {
    id: "raw-9",
    title: "No media format",
    source: "Test Source",
    description: "This article has no image, video, gif, or thumbnail.",
  },
];