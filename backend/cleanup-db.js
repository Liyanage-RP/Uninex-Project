const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const resourceSchema = new mongoose.Schema({}, { strict: false, collection: 'resources' });
const bookmarkSchema = new mongoose.Schema({}, { strict: false, collection: 'bookmarks' });

const User = mongoose.model('User', userSchema);
const Resource = mongoose.model('Resource', resourceSchema);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

const cleanupDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[OK] Connected to MongoDB\n');

    // STEP 1: Keep ONLY the real admin user
    console.log('[DELETE] Cleaning Users...');
    const realAdminEmail = 'admin@my.sliit.lk';
    const deletedUsers = await User.deleteMany({ email: { $ne: realAdminEmail } });
    console.log(`   [OK] Deleted ${deletedUsers.deletedCount} dummy users. Keeping: ${realAdminEmail}\n`);

    // STEP 2: Delete resources with fake PDF URLs (the ones marked with "#")
    console.log('[DELETE] Cleaning Resources...');
    const deletedFakePdfs = await Resource.deleteMany({ fileUrl: '#' });
    console.log(`   [OK] Deleted ${deletedFakePdfs.deletedCount} fake PDF resources\n`);

    // STEP 3: Delete all bookmarks (dummy data)
    console.log('[DELETE] Cleaning Bookmarks...');
    const deletedBookmarks = await Bookmark.deleteMany({});
    console.log(`   [OK] Deleted ${deletedBookmarks.deletedCount} dummy bookmarks\n`);

    // SUMMARY
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[STATS] CLEANUP SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`[OK] Dummy users deleted: ${deletedUsers.deletedCount}`);
    console.log(`[OK] Fake PDFs deleted: ${deletedFakePdfs.deletedCount}`);
    console.log(`[OK] Dummy bookmarks deleted: ${deletedBookmarks.deletedCount}`);
    console.log('\n[RESOURCES] Remaining resources:');
    const remainingResources = await Resource.find();
    console.log(`   Total: ${remainingResources.length}`);
    remainingResources.forEach((r, i) => {
      console.log(`   ${i+1}. [${r.fileType}] ${r.title} - ${r.fileUrl || r.videoUrl}`);
    });

    console.log('\n[OK] Database cleanup complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Error:', err.message);
    process.exit(1);
  }
};

cleanupDB();
