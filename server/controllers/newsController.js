import News from '../models/News.js';

export const getAllNews = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }
    const news = await News.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const article = await News.create(req.body);
    res.status(201).json({ success: true, data: article, message: 'Article published!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article, message: 'Article updated!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikeNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    const userEmail = req.user.email;
    const isLiked = article.likedBy.includes(userEmail);

    if (isLiked) {
      article.likedBy = article.likedBy.filter((e) => e !== userEmail);
      article.likes = Math.max(0, article.likes - 1);
    } else {
      article.likedBy.push(userEmail);
      article.likes += 1;
    }
    await article.save();
    res.status(200).json({ success: true, liked: !isLiked, likes: article.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
