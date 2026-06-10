import axios from "axios";
import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

async function fetchFeed(feedURL: string) {
  let xml: string;

  try {
    const res = await axios.get(feedURL, {
      responseType: "text",
      headers: {
        "User-Agent": "gator",
        accept: "application/rss+xml",
      },
    });
    xml = res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `failed to fetch feed: ${error.response.status} ${error.response.statusText}`,
      );
    }
    throw error;
  }

  const parser = new XMLParser({ processEntities: false });
  let result = parser.parse(xml);

  const channel = result.rss?.channel;
  if (!channel) {
    throw new Error("failed to parse channel");
  }

  if (
    !channel ||
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("failed to parse channel");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

  const rssItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const rss: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rss;
}

export type { RSSFeed, RSSItem };
export { fetchFeed };
