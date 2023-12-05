# React Project - Healthy World

Store for fresh eco fruits and vegatables!

Project description: 

There are two folders - client and server. 

In the client folder is stored client side (UI) of the application. 
The application is starting when write command in the terminal: npm run dev

The architecture of the app: 
1. index.html file - there is wrap html and links to load styles and scripts.
2. public folder - contains some CSS and images.
3. src folder contains:
    3.1 components folder:
        * Home.jsx - contains static home page jsx with link to Products catalog.
        * About.jsx - contains static "about" page jsx.
        * Header.jsx - contains the title component using for the title of every page of the app.
        * NavigationBar.jsx - contains navigation links of the application. It is provided AuthContext to show or hide some of the
            links. When the user is logged in links "Add product", "Logout" and paragraph "Welcome, {name of the user}" are shown and 
            "Register" and "Login" are hidden. When the user is NOT logged in links "Register" and "Login" are shown and links
            "Add product", "Logout" and paragraph "Welcome, {name of the user}" are hidden.
        * Footer.jsx - constains static footer part of the application with logo, quick links and others.
        * NotFound.jsx - component with information when the page is not found. And there is link back to home page.
        * User folder -> Register.jsx - cointains controlled form with fields "email", "password", "repeat password". To control the
            form is used customHook (useForm). It is provided AuthContext with register handler function. The component has own css module file "Register.module.css".
        * User folder -> Login.jsx - cointains controlled form with fields "email", "password". To control the
            form is used customHook (useForm). It is provided AuthContext with login handler function. The component has own css module file "Login.module.css".
        * User folder -> Logout.jsx - invokes functionality that logout the user from the app. It is provided AuthContext.
        * context folder -> Authcontext.jsx - intialise auth context and auth provider. Write user token in localStorage. 
            Declaration of login and register functions, and indicate is user is authenticated.
        * guards folder -> AuthGuard.jsx - Initialise guard component when user is authenticated renders the Outlet component. 
                When the user is NOT authenticated and tries to get to samo page by write it in the url he will be navigate to the Login component.
        * hooks folder -> useForm.js - initialise a custom hook for controled forms. Get initial form values and values onChange and set
                it in values state. Get onSumbit hander and prevents browser from refresh.
        * Products folder -> Products.jsx - stateful component with information for all added products (items) in the application -
                "All products" button is clicked by default. When button "Fruit" is clicked it will load only fruits products and 
                when "Vegetable" button is clicked all vegetables will be loaded.
        * create folder -> CreateProduct.jsx - contains controlled form with fields to be filled with information about the product.
                The components is visible only for authenticated users. Component has own css module file - CreateProduct.module.css
        * edit folder -> EditProduct.jsx - contains controlled form with fields filled with information about the product.
                The components is visible only for authenticated users. Component has own css module file - EditProduct.module.css
        * productItem folder -> contains with template card for item (product) that will be rendered in the Products page.
        * details folder -> ProductDetails.jsx - contains detail information about the product. There is аccess to different
                functionalities like "Edit", "Delete", "Like" and "Buy". Component has own css module file - ProductDetails.module.css
                Only authenticated users can see the buttons "Edit", "Delete" and "Like". Users can edit or delete only their own product items and they can "Like" and "Buy" only other user's product items. Unathenticated users can see this page but 
                not to use the functionalities in it.
        * OrderForm folder -> OrderForm.jsx - contains controlled form for information about the user that orders the product - Name,
                Address and Phone number. Only authenticated users can buy a product. Component has own css module file - 
                OrderForm.module.css .
        * search folder -> Search.jsx -> can search the products by their names. If there is found products they will be renderd bellow
                the search like Products page. If there are NOT any products it will bi rendered "Not found products". Component has own 
                css module file - Search.module.css

    3.2 path folder -> path.js contains object with information for route paths of the application.
    3.3 services folder:
        * authService.js - service for register, login or logout from the server.
        * productServer.js - service for CRUD operations - create, read, update and delete products on the server.
        * likeService.js - service for create and read from likes collection from the server.
        * orderService.js - service to create collection for orders.
    3.4 utils -> pathToUrl.js contains util function for create dynamically a path route with input params.

    3.5 App.jsx - contains context provider and path routes for every component. Routes guard is also provided.
    3.6 main.jsx - invokes App.jsx and initialise BrowserRouter.      
