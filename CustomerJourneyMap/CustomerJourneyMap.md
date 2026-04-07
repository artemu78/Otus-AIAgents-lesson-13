# Customer Journey Map

```mermaid
journey
    title Customer Journey
    section Login
      User opens app: 5: User
      User enters credentials: 4: User
      System authenticates: 4: System
      User logged in: 5: User
    section Check data
      User navigates to dashboard: 4: User
      User views data: 5: User
      User analyzes information: 4: User
    section Logout
      User clicks logout: 5: User
      System ends session: 4: System
      User redirected to login: 5: User
```

---

## Login

The customer initiates their journey by accessing the application and providing their authentication credentials. The system validates the user's identity and grants access to the platform.

## Check data

Once authenticated, the customer navigates through the application to view and analyze their data. This step represents the core value delivery where users interact with the information they need.

## Logout

After completing their tasks, the customer securely exits the application by terminating their session, ensuring their account remains protected.