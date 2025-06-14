import { expect, test } from '@playwright/test';

const SERVER_URL = 'http://localhost:3001';

test('Response intercepted', async ({ page }) => {
	const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body>
        <button id="trigger">Trigger CORS Request</button>
        <div id="result"></div>
        
        <script>
          const SERVER_URL = '${SERVER_URL}';
          
          async function triggerCorsRequest() {
            try {
              const response = await fetch(SERVER_URL + '/api/test', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Custom-Header': 'test-value'
                }
              });
              
              const data = await response.json();
              document.getElementById('result').textContent = 'Success: ' + JSON.stringify(data);
            } catch (error) {
              document.getElementById('result').textContent = 'Error: ' + error.message;
            }
          }

          document.getElementById('trigger').addEventListener('click', triggerCorsRequest, { once: true});
        </script>
      </body>
      </html>
    `;

	await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);

	const postResponsePromise = page.waitForResponse(/localhost:3001/);
	await page.click('#trigger');
	const response = await postResponsePromise;

	// Fails w/ Playwright 1.52.0+ with Firefox
	expect(response.request().method()).toBe('POST');
});
