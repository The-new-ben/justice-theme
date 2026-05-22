import fs from 'node:fs';

const files = {
  recommendations: 'inc/lawyer-recommendations.php',
  onboarding: 'inc/lawyer-onboarding.php',
};

let failures = 0;

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function expect(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }
}

function functionBody(source, functionName) {
  const start = source.indexOf(`function ${functionName}`);
  if (start === -1) {
    return '';
  }

  const braceStart = source.indexOf('{', start);
  if (braceStart === -1) {
    return '';
  }

  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    if (source[index] === '{') {
      depth += 1;
    }
    if (source[index] === '}') {
      depth -= 1;
    }
    if (depth === 0) {
      return source.slice(start, index + 1);
    }
  }

  return '';
}

const recommendations = readFile(files.recommendations);
const onboarding = readFile(files.onboarding);
const submitBody = functionBody(recommendations, 'justice_theme_process_lawyer_recommendation_intake_submission');
const publicGuardBody = functionBody(recommendations, 'justice_theme_lawyer_public_recommendation_meta_query');

expect(recommendations.includes("'justice_reco_token'"), 'private recommendation token CPT is registered');
expect(/'public'\s*=>\s*false/.test(recommendations), 'recommendation token CPT is not public');
expect(recommendations.includes('recommendation_token_hash'), 'token hash meta is registered');
expect(recommendations.includes("hash( 'sha256', $token )"), 'plain token is hashed with SHA-256');
expect(recommendations.includes('wp_generate_password( 40, false, false )'), 'token uses a generated 40 character value');
expect(recommendations.includes("recommendation_token_status'      => 'active'"), 'new tokens start active');
expect(recommendations.includes('justice_theme_lawyer_recommendation_token_url'), 'token URL helper exists');
expect(recommendations.includes('justice_recommendation_token'), 'public token query key exists');
expect(recommendations.includes("add_action( 'template_redirect', 'justice_theme_handle_lawyer_recommendation_intake' )"), 'token intake runs from template_redirect');
expect(recommendations.includes('noindex,nofollow'), 'public token page is noindex,nofollow');
expect(recommendations.includes('recommendation_website'), 'public token form includes a honeypot field');

expect(submitBody.length > 0, 'submission handler is present');
expect(submitBody.includes("'post_status'  => 'draft'"), 'token submissions create draft recommendation records');
expect(!submitBody.includes("'post_status'  => 'publish'"), 'token submissions do not publish recommendation records');
expect(submitBody.includes("update_post_meta( $recommendation_id, 'recommendation_source_type', 'first_party' )"), 'token submissions are stored as first-party recommendations');
expect(submitBody.includes("update_post_meta( $recommendation_id, 'recommendation_permission', 'confirmed' )"), 'token submissions require confirmed permission');
expect(submitBody.includes("update_post_meta( $recommendation_id, 'recommendation_moderation', 'draft_review' )"), 'token submissions remain in draft_review moderation');
expect(!submitBody.includes('approved_public'), 'token submissions do not set approved_public');
expect(submitBody.includes("update_post_meta( $token_id, 'recommendation_token_status', 'used' )"), 'token is consumed after submission or honeypot hit');
expect(submitBody.includes('justice_theme_notify_lawyer_recommendation_submission'), 'owner notification is sent for real submissions');

expect(publicGuardBody.includes("'recommendation_moderation'"), 'public guard checks moderation');
expect(publicGuardBody.includes("'approved_public'"), 'public guard requires approved_public');
expect(publicGuardBody.includes("'recommendation_permission'"), 'public guard checks permission');
expect(publicGuardBody.includes("'confirmed'"), 'public guard requires confirmed permission');
expect(publicGuardBody.includes("'recommendation_source_type'"), 'public guard checks source type');
expect(publicGuardBody.includes('justice_theme_public_recommendation_source_types()'), 'public guard limits allowed source types');

expect(onboarding.includes('justice_theme_admin_latest_recommendation_token_link'), 'onboarding shows generated token link notice');
expect(onboarding.includes('Create recommendation link'), 'onboarding exposes create recommendation link action');
expect(onboarding.includes('justice_theme_lawyer_recommendation_token_create_admin_url'), 'onboarding create-link action uses nonce URL helper');

expect(!recommendations.includes('AggregateRating'), 'recommendation token flow does not add AggregateRating schema');
expect(!recommendations.includes('schema.org/Review'), 'recommendation token flow does not add Review schema');

if (failures > 0) {
  console.error(`Recommendation token safety check failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Recommendation token safety check passed.');
