# Project setup
1. I added some data in customers.json file
2. Please create .env file from .env.sample file for environmental file and use your mongodb atlas username and password

# Installation & command details
1. Run command 'npm install' to install all the packages
2. Run command 'node importCustomers.js' to import/seed data in database
3. Run command 'npm run dev' to use all APIs

# URL information
1. Create customer - localhost:4000/api/v1/create-customer
2. Search customer by first_name, last_name and city with pagination - localhost:4000/api/v1/search?first_name=susil&city=Ahmedabad&page=1&limit=5
3. Get single customer data by its id - localhost:4000/api/v1/customer/id
4. List all the unique cities with number of customers from a particular city - localhost:4000/api/v1/cities/unique
