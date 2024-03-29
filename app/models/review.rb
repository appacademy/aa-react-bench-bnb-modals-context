class Review < ApplicationRecord
  validates :body, presence: true
  validates :rating, inclusion: { in: 1..5, message: "must be between 1 and 5" }
  # validates :bench_id, uniqueness: { scope: :author_id, message: "already has a review from you" }
  validate :not_a_duplicate
  
  belongs_to :bench
  belongs_to :author, class_name: :User

  private

  def not_a_duplicate
    if Review.exists?(author_id: author_id, bench_id: bench_id)
      errors.add(:base, message: "You have already left a review for this bench.")
    end
  end
end
