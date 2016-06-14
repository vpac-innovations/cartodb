# encoding: utf-8

module CartoDB
  module Visualization
    class TableBlender
      def initialize(user, tables=[])
        @user   = user
        @tables = tables
      end

      def blend
        maps            = tables.map(&:map)
        copier          = CartoDB::Map::Copier.new
        firstMap        = maps.first
        firstMap.zoom   = 7
        firstMap.center = [-36.71026542647844, 145.78857421875]
        #firstMap.bounding_box_sw = [-34, 141]
        #firstMap.bounding_box_ne = [-39, 150]
        #firstMap.view_bounds_sw = [-38.62974534092597, 140.7733154296875]
        #firstMap.view_bounds_ne = [-34.74161249883172, 150.80383300781247]
        firstMap.view_bounds_sw = [-39, 140]
        firstMap.view_bounds_ne = [-34, 150]
        destination_map = copier.new_map_from(firstMap).save

        copier.copy_base_layer(maps.first, destination_map)
        maps.each { |map| copier.copy_data_layers(map, destination_map) }
        destination_map
      end

      def blended_privacy
        return Visualization::Member::PRIVACY_PRIVATE if tables.map{|t| t.private?}.any?
        return Visualization::Member::PRIVACY_LINK if tables.map{|t| t.public_with_link_only?}.any?
        Visualization::Member::PRIVACY_PUBLIC
      end

      private

      attr_reader :tables, :user
    end
  end
end

