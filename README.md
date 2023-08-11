
# Saleor Ecommerce

This React application powered by Vite offers a seamless e-commerce experience by leveraging Saleor, Contentful and Klaviyo.

## Table of Contents

1.  [Description](#description)
2.  [Setup & Installation](#setup--installation)
3.  [Features](#features)
4.  [Contributing](#contributing)
5.  [License](#license)

## Description

This project utilizes:

-   **React** for building the UI components.
-   **Vite** as the build tool for a faster and more efficient development experience.
-   **Saleor** for fetching products, managing the cart, checking out items, and handling payments.
-   **Contentful** for fetching static content for the Header and Footer.
-   **Klaviyo** for sending order confirmation emails
-   **Stripe** for secure payment integration.

## Setup & Installation

**Prerequisites:**

-   Node.js installed.
-   Contentful account setup with respective space and tokens.
-   Saleor Cloud account and configurations ready.
-   Klaviyo account

**Steps:**

1.  Clone the repository.



	`git clone <repository-url>` 

2.  Install dependencies.



	```
	cd saleor-ecommerce
	 npm install
	 ```

3.  Create a `.env` file in the root directory and add your Contentful, Saleor and Stripe credentials:

	```

			VITE_SALEOR_GRAPHQL_URL=<saleor-graphql-url>
			VITE_FRONTEND_URL=<frontend-url>
            VITE_STRIPE_PUB_KEY=<stripe-key>
            VITE_DELIVERY_METHOD_ID=<delivery-method-id>
            VITE_CONTENTFUL_SPACE_ID=<contentful-space-id>
            VITE_CONTENTFUL_DELIVERY_TOKEN=<delivery-token>
            VITE_CONTENTFUL_HEADER_ENTRY_ID=<entryid-for-header>
            VITE_CONTENTFUL_FOOTER_ENTRY_ID=<entryid-for-footer>
            VITE_CONTENTFUL_GRAPHQL_API=<contentful-graphql-url>
4.  Run the application.
	```
	npm run dev
	```


## Features

1.  **Product List Page:** Display a list of products fetched dynamically from Saleor.
2.  **Cart Functionality:** Add products to the cart and view your selected items.
3.  **Checkout:** Seamlessly check out your cart items.
4.  **Payment Integration:** Securely process payments using Stripe, integrated through Saleor.
5.  **Confirmation Emails** Sending order confirmation emails via Klaviyo

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)