export const checkNullOrUndefined = (variable) => {
  if (
    typeof variable === "undefined" ||
    variable === null ||
    variable.replace(" ", "") === ""
  ) {
    return false;
  } else {
    return true;
  }
};

export const isNumberContain = (variable) => {
  return !/\d/.test(variable);
};

export const isStringContain = (variable) => {
  if (checkNullOrUndefined(variable)) {
    const containsString = /[0-9]/.search(variable) !== null;

    if (containsString) {
      return true;
    } else {
      res.status(400).send(`This ${fieldName} field can'not contain strings`);
      return false;
    }
  } else return false;
};

export const availabilityCorrect = (availability) => {
  if (availability === "Part time" || availability === "Full time") {
    return true;
  } else return false;
};

export const emailCorrect = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const findUserByEmail = async (email, Seller) => {
  try {
    console.log("Searching for user with email:", email);
    const user = await Seller.findOne({ email: email });
    if (user) {
      console.log("Found user:", user._id);
      return user;
    } else return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
