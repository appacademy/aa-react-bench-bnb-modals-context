class Api::BenchesController < ApplicationController
  before_action :require_logged_in, only: :create
  wrap_parameters include: Bench.attribute_names + [:photo], format: :multipart_form

  def index
    @benches = Bench.includes(:reviews)
    @benches = @benches.in_bounds(bounds) if bounds
    @benches = @benches.where(seating: seating_range) if seating_range
  end

  def show
    @bench = Bench.find(params[:id])
  end

  def create
    @bench = Bench.new(bench_params)
    unless @bench.photo.attached?
      @bench.photo.attach(
        io: File.open(Rails.root.join("db/seed_assets/bench_placeholder.png")), 
        filename: "bench_placeholder.png"
      )
    end
    if @bench.save
      render :show
    else 
      render json: { errors: @bench.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def bench_params
    params.require(:bench).permit(
      :title,
      :description,
      :price,
      :lat,
      :lng,
      :seating,
      :photo
    )
  end

  def seating_range
    return nil unless params[:min_seating] && params[:max_seating]
    params[:min_seating]..params[:max_seating]
  end

  def bounds
    params[:bounds]&.split(',').map(&:to_f)
  end
end
