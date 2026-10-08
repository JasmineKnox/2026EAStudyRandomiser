const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'../index.html'));
 assert.equal(await page.locator('#subject-list fieldset:visible').count(),1);
 await page.locator('input[value=english]').check();await page.locator('#option-english').selectOption('The Dry');await page.locator('#setup-next').click();
 assert.equal(await page.locator('#subject-list fieldset:visible legend').textContent(),'Select your Maths');await page.locator('input[value=maths_methods]').check();await page.locator('#setup-next').click();
 await page.locator('input[value=legal]').check();await page.locator('#setup-save').click();await page.locator('#session-duration').fill('30');await page.locator('#session-mode').selectOption('hard');await page.locator('#generate').click();
 assert.equal(await page.locator('#task-meta').textContent(),'10 minutes · Hard mode');assert.equal(await page.locator('#task-steps').evaluate(e=>e.tagName),'UL');
 await page.locator('#done').click();assert.equal(await page.locator('#task-subject').textContent(),'Mathematical Methods');await page.reload();assert.equal(await page.locator('#task-subject').textContent(),'Mathematical Methods');
 await page.locator('#done').click();assert.equal(await page.locator('#task-subject').textContent(),'Legal Studies');await page.locator('#done').click();assert.match(await page.locator('#ready-message').textContent(),/Session complete/);
 await page.locator('#new-session').click();await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.resolve(__dirname,'../../session-preview.png'),fullPage:true});assert.deepEqual(errors,[]);await browser.close();console.log('PASS: browser wizard, session duration/mode, bullet lists, completion, reload and mobile width.');
})().catch(e=>{console.error(e);process.exit(1)});
