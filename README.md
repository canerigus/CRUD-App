# Typescript-Authentication Demo With JWT & Session 

## Description
This project is a CRUD APP with basic authentication demo using JWT and image uploads with cloudinary API. You can register, login, CRUD your profile and see other community members. At first a default profile pic is given to every user. Every user then can upload a profile pic, change your info to be displayed. 

Main routes are /profile & /community

![authhome](https://user-images.githubusercontent.com/61908293/150197444-e7876236-ef1e-49f6-93e9-254ed4a0bc33.png)

![profile](https://user-images.githubusercontent.com/61908293/151853226-725cc730-c8d8-4085-8efe-fcdab25d3c03.png)

![community](https://user-images.githubusercontent.com/61908293/151853198-d298ae4c-a96a-487f-b37c-343f38fef514.png)


### Main dev tools used:

`NodeJS & ExpressJS` - `Typescript` - `TypeORM` -  `MySQL` - `EJS` - `CloudinaryAPI`

### Installation
Use the package manager **npm** to deploy dependencies after clonening the project.

```bash
npm install 
```
### Usage

```bash
npm run dev
```
- _**MUST** have MySQL installed in your local_

### .env
.env file contains the following; Replace the information below accordingly. You should open a FREE cloudinary developer account for cloudinary variables.
- ACCESS_TOKEN_SECRET=your_secret_here
- PORT=your_port_number_here
- CLOUDINARY_CLOUD_NAME=your_cloudinary_name_here
- CLOUDINARY_KEY=your_cloudinary_key_here
- CLOUDINARY_SECRET=your_cloudinary_secret_key_here
- CLOUDINARY_DEFAULT_PROFILE_PIC=your_any_default_picture_url_here_

### License
[MIT](https://choosealicense.com/licenses/mit/)
