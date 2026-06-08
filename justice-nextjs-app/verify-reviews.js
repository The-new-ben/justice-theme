import { getApprovedReviews, submitReview, approveReview } from './src/lib/reviews.js';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- Starting Verification ---');
  
  // 1. Get initial approved reviews
  console.log('\n1. Fetching initial approved reviews...');
  const initialResult = await getApprovedReviews();
  console.log('Success:', initialResult.success);
  console.log('Source:', initialResult.source);
  console.log('Aggregate Rating:', initialResult.aggregateRating);
  console.log('Total Approved Reviews:', initialResult.reviews.length);
  
  const expectedInitialLength = initialResult.reviews.length;

  // 2. Submit a new review
  console.log('\n2. Submitting a new pending review...');
  const newReviewData = {
    reviewer_name: 'ישראל ישראלי',
    reviewer_role: 'Client',
    rating: 5,
    content: 'בדיקת מערכת - חוות דעת מצוינת!'
  };
  const submitResult = await submitReview(newReviewData);
  console.log('Success:', submitResult.success);
  console.log('Submitted Review ID:', submitResult.review.id);
  console.log('Approval Status (should be false):', submitResult.review.approval_status);

  // Verify it doesn't show up in approved reviews yet
  const afterSubmitResult = await getApprovedReviews();
  if (afterSubmitResult.reviews.length !== expectedInitialLength) {
    throw new Error('Pending review incorrectly listed in approved reviews list.');
  }
  console.log('Verified: Pending review not listed in approved reviews.');

  // 3. Approve the review
  console.log('\n3. Approving the review...');
  const approveResult = await approveReview(submitResult.review.id);
  console.log('Success:', approveResult.success);
  console.log('Approved:', approveResult.approved);

  // 4. Verify it is now approved and aggregate is updated
  console.log('\n4. Fetching approved reviews after approval...');
  const finalResult = await getApprovedReviews();
  console.log('Total Approved Reviews now:', finalResult.reviews.length);
  console.log('New Aggregate Rating:', finalResult.aggregateRating);
  
  if (finalResult.reviews.length !== expectedInitialLength + 1) {
    throw new Error('Approved review not found in the final approved list.');
  }
  
  const newlyApproved = finalResult.reviews.find(r => r.id === submitResult.review.id);
  if (!newlyApproved || newlyApproved.approval_status !== true) {
    throw new Error('Approved review status is not true, or it was not found.');
  }
  console.log('Verified: Review is now in the approved list and marked true!');

  // Cleanup: Restore the reviews-cache.json to only contain the 7 original reviews
  console.log('\n5. Cleaning up test reviews from cache...');
  
  const currentReviews = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/lib/reviews-cache.json'), 'utf-8'));
  const cleanedReviews = currentReviews.filter(r => r.id.startsWith('rev_') && parseInt(r.id.split('_')[1]) < 10);
  fs.writeFileSync(path.join(process.cwd(), 'src/lib/reviews-cache.json'), JSON.stringify(cleanedReviews, null, 2), 'utf-8');
  console.log('Cleanup complete.');

  console.log('\n--- Verification completed successfully! ---');
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
