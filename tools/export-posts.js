const fs = require('fs');

async function fetchPosts() {
  let p = 1, posts = [];
  const url = 'https://jus-tice.co.il/wp-json/wp/v2/articles?per_page=100&page=';
  
  while (true) {
    try {
      const res = await fetch(url + p);
      if (!res.ok) {
        console.log('Finished or hit limit on page ' + p + ' (Status: ' + res.status + ')');
        break;
      }
      const data = await res.json();
      if (!data || data.length === 0) break;
      posts.push(...data);
      console.log('Fetched page ' + p + ', total: ' + posts.length);
      p++;
    } catch (e) {
      console.error(e);
      break;
    }
  }

  const header = 'id,url,slug,title,status';
  const csvLines = posts.map(post => {
    const title = post.title && post.title.rendered ? post.title.rendered.replace(/"/g, '""') : '';
    return `${post.id},${post.link},${post.slug},"${title}",${post.status}`;
  });

  const csv = [header].concat(csvLines).join('\n');
  fs.writeFileSync('c:/Users/pro/justice/project-control/full-inventory.csv', csv);
  console.log('Saved ' + posts.length + ' posts to project-control/full-inventory.csv');
}

fetchPosts();
