# RateSpace --- User Guide

RateSpace is a store-rating platform with three roles: **Normal User**,
**Store Owner**, and **System Administrator**. The pages and actions
available after login depend on your role.

## 1. Register or Sign In

-   Open the RateSpace website.
-   Select **Register** to create an account if public registration is
    enabled, or select **Log in** if you already have an account.
-   Complete the required fields and submit the form.
-   After signing in, use the dashboard and navigation options available
    to your account.

## 2. How to Get Each Role

### Normal User

1.  Select **Register** on the website.
2.  Enter your details and submit the form.
3.  Log in with your new account.
4.  Open the store listing, search for a store, choose a rating, and
    submit it.

Public registration should create a normal-user account unless the
application explicitly implements another approved flow.

### Store Owner

1.  Ask the System Administrator to create an account for you.
2.  The administrator opens the **Admin Dashboard** and uses **Create
    User**.
3.  The administrator enters your details and selects **Store Owner** as
    your role.
4.  The administrator creates your store using **Create Store** and
    assigns your account as its owner, if prompted.
5.  Log in with the account provided and open the **Store Owner
    Dashboard** to view your store's rating information.

### System Administrator

1.  Administrator accounts should be created or provisioned by the
    project owner through a secure setup process, or by an existing
    authorised administrator if the application permits it.
2.  Do not assume that choosing "Administrator" on a public registration
    form will safely grant administrator access.
3.  Once signed in, an administrator can open the **Admin Dashboard** to
    manage users and stores and, if supported by the application, create
    accounts with the appropriate roles.

**Security note:** Do not make administrator access available to
everyone through public self-registration. Keep administrator
credentials private.

## 3. Administrator Tasks

-   **Create User:** enter the required details and choose the
    appropriate role.
-   **Create Store:** enter the store name and address, then select its
    owner if requested.
-   Use the management sections to review existing users and stores.
-   Check the on-screen message after submitting a form.

## 4. Important Tips

-   Choose the correct role; it determines which dashboard and actions
    are available.
-   Store owners should be assigned to the correct store.
-   Check required fields before submitting forms.
-   Log out on shared devices and never share passwords, tokens, or
    other confidential information.

## 5. Troubleshooting

-   **Cannot log in:** check your credentials or contact the
    administrator.
-   **Wrong dashboard or missing access:** confirm that your account has
    the correct role.
-   **Data does not load:** check your connection and try again.
-   **Form submission fails:** review required fields and the error
    message.
-   **Page looks incorrect:** on Windows, hard-refresh with
    `Ctrl + Shift + R`.

If the problem continues, contact the project administrator and share
the page name and error details. Do not send passwords or secrets.
