class Bench < ApplicationRecord
  validates :title, :description, :lat, :lng, presence: true
  validates :price, inclusion: { in: 10...1000, message: "must be between $10 and $1000" }

  has_many :reviews, dependent: :destroy
  has_one_attached :photo

  def self.in_bounds(bounds)
    lower_lat, lower_lng, upper_lat, upper_lng = bounds
    where(lat: lower_lat..upper_lat, lng: lower_lng..upper_lng)
  end

  def average_rating
    average = reviews.average(:rating)
    average && average.round(1)
  end
end
