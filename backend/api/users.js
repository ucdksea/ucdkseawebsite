// 404 봉인 (공개 목록 금지)
module.exports = (req, res) => {
    res.status(404).send("Not Found");
  };
  