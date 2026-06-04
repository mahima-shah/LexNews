export function normalizeMedia(item) {
    const media = [];
  
    const content = item["content:encoded"] || "";
  
    const addMedia = (mediaItem) => {
      if (!mediaItem?.url) return;
      if (media.some((m) => m.url === mediaItem.url)) return;
      media.push(mediaItem);
    };
  
    // 1. Video from enclosure
    if (item.enclosure?.type?.startsWith("video")) {
      const videoUrl = item.enclosure.url;
      const videoId = getYouTubeId(videoUrl);
  
      addMedia({
        type: "video",
        url: videoUrl,
        thumbnail_url:
          extractFirstImage(content) ||
          (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null),
        is_primary: true,
      });
    }
  
    // 2. YouTube iframe inside content
    const iframeUrl = extractYouTubeIframe(content);
    if (iframeUrl) {
      const videoId = getYouTubeId(iframeUrl);
  
      addMedia({
        type: "video",
        url: iframeUrl,
        thumbnail_url: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : extractFirstImage(content),
        is_primary: media.length === 0,
      });
    }
  
    // 3. ET / Bar & Bench media:content
    const mediaContent = item["media:content"];
    if (mediaContent?.url) {
      addMedia({
        type: detectType(mediaContent.url),
        url: mediaContent.url,
        thumbnail_url: item["media:thumbnail"]?.url,
        caption: mediaContent["media:title"] || "",
        width: mediaContent.width,
        height: mediaContent.height,
        is_primary: media.length === 0,
      });
    }
  
    // 4. Bar & Bench media:thumbnail fallback
    if (item["media:thumbnail"]?.url) {
      addMedia({
        type: "image",
        url: item["media:thumbnail"].url,
        is_primary: media.length === 0,
      });
    }
  
    // 5. LawBeat image tag
    if (item.image) {
      addMedia({
        type: detectType(item.image),
        url: item.image,
        caption: item.imagecaption || "",
        is_primary: media.length === 0,
      });
    }
  
    // 6. LiveLaw normal image enclosure
    if (item.enclosure?.type?.startsWith("image")) {
      addMedia({
        type: detectType(item.enclosure.url),
        url: item.enclosure.url,
        is_primary: media.length === 0,
      });
    }
  
    // 7. All inline images from content:encoded
    const inlineImages = extractAllImages(content);
  
    inlineImages.forEach((url) => {
      addMedia({
        type: detectType(url),
        url,
        is_primary: media.length === 0,
      });
    });
  
    return media;
  }
  
  function detectType(url = "") {
    if (url.includes(".gif")) return "gif";
    return "image";
  }
  
  function extractFirstImage(html = "") {
    return extractAllImages(html)[0] || null;
  }
  
  function extractAllImages(html = "") {
    const matches = [...html.matchAll(/<img[^>]+src=['"]([^'"]+)['"]/g)];
    return matches.map((match) => match[1]);
  }
  
  function extractYouTubeIframe(html = "") {
    const match = html.match(/<iframe[^>]+src=['"]([^'"]*youtube\.com\/embed\/[^'"]+)['"]/);
    if (!match) return null;
  
    let url = match[1];
  
    if (url.startsWith("//")) {
      url = `https:${url}`;
    }
  
    return url;
  }
  
  function getYouTubeId(url = "") {
    const embedMatch = url.match(/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];
  
    const watchMatch = url.match(/[?&]v=([^?&]+)/);
    if (watchMatch) return watchMatch[1];
  
    return null;
  }