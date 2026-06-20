package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type ForumRepo struct {
	db *gorm.DB
}

func NewForumRepo(db *gorm.DB) *ForumRepo {
	return &ForumRepo{db: db}
}

func (r *ForumRepo) ListActive() ([]model.Forum, error) {
	var forums []model.Forum
	err := r.db.Where("is_active = ?", true).Order("sort_order ASC, id ASC").Find(&forums).Error
	return forums, err
}

func (r *ForumRepo) ListAll() ([]model.Forum, error) {
	var forums []model.Forum
	err := r.db.Order("sort_order ASC, id ASC").Find(&forums).Error
	return forums, err
}

func (r *ForumRepo) GetByID(id int64) (*model.Forum, error) {
	var f model.Forum
	err := r.db.First(&f, id).Error
	return &f, err
}

func (r *ForumRepo) Create(f *model.Forum) error {
	return r.db.Create(f).Error
}

func (r *ForumRepo) Update(f *model.Forum) error {
	return r.db.Save(f).Error
}

func (r *ForumRepo) Delete(id int64) error {
	return r.db.Delete(&model.Forum{}, id).Error
}

type TopicRepo struct {
	db *gorm.DB
}

func NewTopicRepo(db *gorm.DB) *TopicRepo {
	return &TopicRepo{db: db}
}

func (r *TopicRepo) ListByForum(forumID int64, offset, limit int) ([]model.Topic, error) {
	var topics []model.Topic
	err := r.db.Where("forum_id = ?", forumID).
		Order("is_sticky DESC, last_post_at DESC").
		Limit(limit).Offset(offset).
		Find(&topics).Error
	if err != nil {
		return nil, err
	}
	for i := range topics {
		var u model.User
		if err := r.db.Select("username").First(&u, topics[i].UserID).Error; err == nil {
			topics[i].Username = u.Username
		}
	}
	return topics, err
}

func (r *TopicRepo) ListRecent(offset, limit int) ([]model.Topic, error) {
	var topics []model.Topic
	err := r.db.Order("is_sticky DESC, last_post_at DESC").
		Limit(limit).Offset(offset).
		Find(&topics).Error
	if err != nil {
		return nil, err
	}
	for i := range topics {
		var u model.User
		if err := r.db.Select("username").First(&u, topics[i].UserID).Error; err == nil {
			topics[i].Username = u.Username
		}
		var f model.Forum
		if err := r.db.Select("name").First(&f, topics[i].ForumID).Error; err == nil {
			topics[i].ForumName = f.Name
		}
	}
	return topics, err
}

func (r *TopicRepo) CountAll() (int64, error) {
	var count int64
	err := r.db.Model(&model.Topic{}).Count(&count).Error
	return count, err
}

func (r *TopicRepo) GetByID(id int64) (*model.Topic, error) {
	var t model.Topic
	err := r.db.First(&t, id).Error
	if err != nil {
		return nil, err
	}
	var u model.User
	if err := r.db.Select("username").First(&u, t.UserID).Error; err == nil {
		t.Username = u.Username
	}
	var f model.Forum
	if err := r.db.Select("name").First(&f, t.ForumID).Error; err == nil {
		t.ForumName = f.Name
	}
	return &t, err
}

func (r *TopicRepo) Create(t *model.Topic) error {
	return r.db.Create(t).Error
}

func (r *TopicRepo) Update(t *model.Topic) error {
	return r.db.Save(t).Error
}

func (r *TopicRepo) Delete(id int64) error {
	return r.db.Delete(&model.Topic{}, id).Error
}

func (r *TopicRepo) IncrementViews(id int64) error {
	return r.db.Model(&model.Topic{}).Where("id = ?", id).
		UpdateColumn("views", gorm.Expr("views + 1")).Error
}

func (r *TopicRepo) IncrementPostCount(id int64) error {
	return r.db.Model(&model.Topic{}).Where("id = ?", id).
		UpdateColumn("post_count", gorm.Expr("post_count + 1")).Error
}

func (r *TopicRepo) CountByForum(forumID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Topic{}).Where("forum_id = ?", forumID).Count(&count).Error
	return count, err
}

func (r *TopicRepo) Search(query string, offset, limit int) ([]model.Topic, error) {
	var topics []model.Topic
	like := "%" + query + "%"
	err := r.db.Where("title LIKE ?", like).
		Order("last_post_at DESC").
		Limit(limit).Offset(offset).
		Find(&topics).Error
	if err != nil {
		return nil, err
	}
	for i := range topics {
		var u model.User
		if err := r.db.Select("username").First(&u, topics[i].UserID).Error; err == nil {
			topics[i].Username = u.Username
		}
	}
	return topics, err
}

func (r *TopicRepo) SearchCount(query string) (int64, error) {
	var count int64
	like := "%" + query + "%"
	err := r.db.Model(&model.Topic{}).Where("title LIKE ?", like).Count(&count).Error
	return count, err
}

func (r *TopicRepo) ListUnread(userID int64, offset, limit int) ([]model.Topic, error) {
	var topics []model.Topic
	err := r.db.Model(&model.Topic{}).
		Joins("LEFT JOIN read_posts ON read_posts.topic_id = topics.id AND read_posts.user_id = ?", userID).
		Where("read_posts.id IS NULL OR read_posts.post_id < (SELECT COALESCE(MAX(id), 0) FROM posts WHERE posts.topic_id = topics.id)").
		Order("is_sticky DESC, last_post_at DESC").
		Limit(limit).Offset(offset).
		Find(&topics).Error
	if err != nil {
		return nil, err
	}
	for i := range topics {
		var u model.User
		if err := r.db.Select("username").First(&u, topics[i].UserID).Error; err == nil {
			topics[i].Username = u.Username
		}
		var f model.Forum
		if err := r.db.Select("name").First(&f, topics[i].ForumID).Error; err == nil {
			topics[i].ForumName = f.Name
		}
	}
	return topics, err
}

func (r *TopicRepo) CountUnread(userID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Topic{}).
		Joins("LEFT JOIN read_posts ON read_posts.topic_id = topics.id AND read_posts.user_id = ?", userID).
		Where("read_posts.id IS NULL OR read_posts.post_id < (SELECT COALESCE(MAX(id), 0) FROM posts WHERE posts.topic_id = topics.id)").
		Count(&count).Error
	return count, err
}

type PostRepo struct {
	db *gorm.DB
}

func NewPostRepo(db *gorm.DB) *PostRepo {
	return &PostRepo{db: db}
}

func (r *PostRepo) ListByTopic(topicID int64, offset, limit int) ([]model.Post, error) {
	var posts []model.Post
	err := r.db.Where("topic_id = ?", topicID).
		Order("created_at ASC").
		Limit(limit).Offset(offset).
		Find(&posts).Error
	if err != nil {
		return nil, err
	}
	for i := range posts {
		var u model.User
		if err := r.db.Select("username").First(&u, posts[i].UserID).Error; err == nil {
			posts[i].Username = u.Username
		}
	}
	return posts, err
}

func (r *PostRepo) GetByID(id int64) (*model.Post, error) {
	var p model.Post
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PostRepo) Create(p *model.Post) error {
	return r.db.Create(p).Error
}

func (r *PostRepo) Update(p *model.Post) error {
	return r.db.Save(p).Error
}

func (r *PostRepo) Delete(id int64, userID int64) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&model.Post{}).Error
}

func (r *PostRepo) DeleteByAdmin(id int64) error {
	return r.db.Delete(&model.Post{}, id).Error
}

func (r *PostRepo) CountByTopic(topicID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Post{}).Where("topic_id = ?", topicID).Count(&count).Error
	return count, err
}

func (r *PostRepo) GetLatestPostID(topicID int64) (int64, error) {
	var p model.Post
	err := r.db.Where("topic_id = ?", topicID).Order("id DESC").First(&p).Error
	if err != nil {
		return 0, err
	}
	return p.ID, nil
}

type ReadPostRepo struct {
	db *gorm.DB
}

func NewReadPostRepo(db *gorm.DB) *ReadPostRepo {
	return &ReadPostRepo{db: db}
}

func (r *ReadPostRepo) Get(userID, topicID int64) (*model.ReadPost, error) {
	var rp model.ReadPost
	err := r.db.Where("user_id = ? AND topic_id = ?", userID, topicID).First(&rp).Error
	return &rp, err
}

func (r *ReadPostRepo) Upsert(rp *model.ReadPost) error {
	var existing model.ReadPost
	result := r.db.Where("user_id = ? AND topic_id = ?", rp.UserID, rp.TopicID).First(&existing)
	if result.Error != nil {
		return r.db.Create(rp).Error
	}
	return r.db.Model(&existing).UpdateColumn("post_id", rp.PostID).Error
}
