import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface Post {
  id: string;
  content_html: string;
  url: string;
  title: string;
  summary: string;
  date_modified: string;
  tags: string[];
}

interface BlogHistoryProps {
  posts?: Post[];
  static?: boolean;
  width?: number;
  height?: number;
}

export default function BlogHistory({ posts = [], static: isStatic = false, width = 800, height = 400 }: BlogHistoryProps) {
  if (!posts || posts.length === 0) {
    return <div>No blog posts available</div>;
  }

  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(a.date_modified).getTime() - new Date(b.date_modified).getTime(),
  );

  const startDate = new Date(sortedPosts[0].date_modified);
  const endDate = new Date(sortedPosts[sortedPosts.length - 1].date_modified);

  const generateMonths = (start: Date, end: Date) => {
    const months: Date[] = [];
    const currentDate = new Date(start);
    currentDate.setDate(1);

    while (currentDate <= end) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  };

  const months = generateMonths(startDate, endDate);

  const getOptimalInterval = (months: Date[]) => {
    const totalMonths = months.length;

    if (totalMonths <= 8) return 1;
    if (totalMonths <= 16) return 2;
    if (totalMonths <= 24) return 3;
    if (totalMonths <= 36) return 4;
    if (totalMonths <= 48) return 6;
    return 12;
  };

  const monthlyData = months.map((monthStart, index) => {
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);

    const postsInMonth = sortedPosts.filter((post) => {
      const postDate = new Date(post.date_modified);
      return postDate >= monthStart && postDate <= monthEnd;
    });

    const interval = getOptimalInterval(months);
    const showLabel = index % interval === 0;

    const postSizes = postsInMonth.reduce(
        (acc: { [key: string]: number }, post, idx) => {
          // Check if we're in a browser environment
          if (typeof window !== 'undefined') {
            // Use DOMParser in the browser
            const parser = new DOMParser();
            const doc = parser.parseFromString(post.content_html, 'text/html');
            
            // Select all text nodes, excluding those within <code>, <pre>, and <img> tags
            const textNodes = Array.from(doc.body.childNodes).filter(node => 
              node.nodeType === Node.TEXT_NODE || 
              (node.nodeType === Node.ELEMENT_NODE && 
              !['CODE', 'PRE', 'IMG'].includes(node.nodeName))
            );
            
            // Calculate the total length of text content
            const textContent = textNodes.reduce((text, node) => 
              text + (node.textContent || ''), ''
            );
            
            // Store the size in KB
            acc[`post${idx + 1}`] = textContent.length / 1024;
          } else {
            // Fallback for server-side rendering
            // This is a simple approximation, you might want to use a more sophisticated method
            const textContent = post.content_html.replace(/<[^>]*>/g, '');
            acc[`post${idx + 1}`] = textContent.length / 1024;
          }
          return acc;
        },
        {},
      );

    return {
      month: monthStart.toISOString().substring(0, 7),
      monthDisplay: monthStart.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      }),
      showLabel,
      posts: postsInMonth,
      ...postSizes,
    };
  });

  const maxVolume = Math.max(
    ...monthlyData.flatMap((data) =>
      Object.entries(data)
        .filter(([key]) => key.startsWith("post"))
        .map(([, value]) => (typeof value === "number" ? value : 0)),
    ),
  );

  const getPostColor = (index: number) => {
    const colors = ["#0088CC", "#00AAFF", "#33BBFF", "#66CCFF", "#99DDFF"];
    return colors[index % colors.length];
  };

  const maxPosts = Math.max(...monthlyData.map((data) => data.posts.length));

  const BarChartContent = (
    <BarChart
      width={isStatic ? width : undefined}
      height={isStatic ? height : undefined}
      data={monthlyData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis
        dataKey="monthDisplay"
        type="category"
        interval={getOptimalInterval(months) - 1}
        height={60}
        tick={{ fontSize: 14 }}
      />
      <YAxis
        label={{
          value: "Words",
          angle: -90,
          position: "insideLeft",
          offset: -1,
          style: {
            textAnchor: "middle",
            fontSize: 14,
          },
        }}
        tick={false}
        width={30}
        domain={[0, Math.ceil(maxVolume)]}
      />
      {Array.from({ length: maxPosts }, (_, i) => (
        <Bar
          key={`post${i + 1}`}
          dataKey={`post${i + 1}`}
          stackId="posts"
          fill={getPostColor(i)}
          name={`Post ${i + 1}`}
        />
      ))}
    </BarChart>
  );

  return (
    <div style={{ width: isStatic ? width : "100%", height: isStatic ? height : 400 }}>
      {isStatic ? (
        BarChartContent
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {BarChartContent}
        </ResponsiveContainer>
      )}
    </div>
  );
}