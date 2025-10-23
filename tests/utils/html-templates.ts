// Shared HTML templates for testing
export function getUsersPageHtml(apiUrl: string = '/api/users'): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>User List</title>
    </head>
    <body>
        <h2>Users</h2>
        <ul id="user-list">
            </ul>
        <p id="error-message" style="color: red;"></p>

        <script>
            (async function() {
                const userList = document.getElementById('user-list');
                const errorMessage = document.getElementById('error-message');
                try {
                    const response = await fetch('${apiUrl}'); 
                    
                    if (!response.ok) {
                        throw new Error('Failed to load users: ' + response.statusText);
                    }
                    
                    const users = await response.json();
                    
                    if (users.length === 0) {
                        userList.innerHTML = '<li>No registered users found.</li>';
                    } else {
                        users.forEach(user => {
                            const li = document.createElement('li');
                            li.textContent = \`\${user.id}: \${user.name} (\${user.email})\`;
                            userList.appendChild(li);
                        });
                    }
                } catch (error) {
                    errorMessage.textContent = 'An error occurred: ' + error.message;
                }
            })();
        </script>
    </body>
    </html>
  `;
}