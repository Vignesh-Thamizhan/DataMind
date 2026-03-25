const axios = require("axios");

exports.runQuery = async (req, res) => {
  const { query } = req.body;

  const ai = await axios.post("http://localhost:8000/query", {
    query
  });

  res.json(ai.data);
};