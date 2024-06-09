import CommentModel from "../models/Comment.js";

export const getAll = async (req, res) => {
  try {
    const comment = await CommentModel.find()
      .populate("user")
      .populate("post")
      .exec();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удолось получить комментарии",
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.postId,
    });
    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удолось создать комментарий",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await CommentModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({ message: "Ошибка" });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось удалить комментарий" });
  }
};
