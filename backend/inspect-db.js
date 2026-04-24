const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas to match your models
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const resourceSchema = new mongoose.Schema({}, { strict: false, collection: 'resources' });
const postSchema = new mongoose.Schema({}, { strict: false, collection: 'posts' });
const bookmarkSchema = new mongoose.Schema({}, { strict: false, collection: 'bookmarks' });

const User = mongoose.model('User', userSchema);
const Resource = mongoose.model('Resource', resourceSchema);
const Post = mongoose.model('Post', postSchema);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

const inspectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[OK] Connected to MongoDB\n');

    // USERS
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👥 USERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const users = await User.find();
    console.log(`Total: ${users.length}\n`);
    users.forEach((u, i) => {
      console.log(`${i+1}. ${u.name || 'N/A'} | ${u.email || 'N/A'} | Role: ${u.role || 'N/A'}`);
    });

    // RESOURCES
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[RESOURCES] RESOURCES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const resources = await Resource.find();
    console.log(`Total: ${resources.length}\n`);
    resources.forEach((r, i) => {
      const type = r.fileType || 'N/A';
      const title = r.title || 'N/A';
      const url = r.fileUrl || r.videoUrl || 'N/A';
      console.log(`${i+1}. [${type.toUpperCase()}] ${title}`);
      console.log(`   URL: ${url}`);
      console.log(`   Views: ${r.viewCount || 0} | Downloads: ${r.downloadCount || 0}`);
    });

    // POSTS
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[POSTS] POSTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const posts = await Post.find();
    console.log(`Total: ${posts.length}\n`);
    posts.forEach((p, i) => {
      console.log(`${i+1}. ${p.content || 'N/A'}`);
      console.log(`   Likes: ${p.likes?.length || 0}`);
    });

    // BOOKMARKS
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[BOOKMARKS] BOOKMARKS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const bookmarks = await Bookmark.find();
    console.log(`Total: ${bookmarks.length}\n`);
    bookmarks.forEach((b, i) => {
      console.log(`${i+1}. Resource: ${b.resourceId || 'N/A'} | User: ${b.userId || 'N/A'}`);
    });

    console.log('\n[OK] Database inspection complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Error:', err.message);
    process.exit(1);
  }
};

inspectDB();
