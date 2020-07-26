const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; //Porque no es autenticacion mediante google ni nada de eso, es local los datos locales

const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", //se autentica mediante email
    },
    async (email, password, callback) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return callback(null, false, { message: "User not found" }); //El mensaje se guarda como variable error es un mensaje flash así que lo tenemos que declarar en index.js como variable global flash
      } else {
        const match = await user.matchPassword(password); //se ejecuta el metodo para hacer match del User
        if (match) {
          return callback(null, user); //se autentica el usuario
        } else {
          return callback(null, false, { message: "Incorrect password" });
        }
      }
    }
  )
); //proceso de autenticacion de usuario

passport.serializeUser((user, callback) => {
  //Si en el metodo anterior el usuario de antentica, se ejecuta este metodo y genera un id de usuario en la sesion para mantenerlo en sesión y no pedirle que haga login en todas las paginas
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  //Si se obtiene el id en el metodo anterior, usa ese id para buscar ese usuario mediante el id y te devuelve los datos del usuario o un error en caso que haya alguno
  User.findById(id, (err, user) => {
    callback(err, user);
  });
});
