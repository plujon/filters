def partial(filename)
  contents = File.read(filename + ".erb")
  bind = binding
  ERB.new(contents, nil, "-").result(bind)
end

def filters
  return @filters if @filters
  require 'yaml'
  @filters = YAML::load_file("data.yml")
  hidden_features = ['dns', 'etchosts', 'iptables']
  @filters.each do |x|
    %w(audience features platform).each do |w|
      x[w] = x[w].split(/\s+/) if x[w]
    end
    if x["features"]
      x["features"].reject! { |x| hidden_features.include?(x) }
    end
  end
  @filters.select! { |x| !x["url"].to_s.empty? }
  @filters.reject! { |x| x["audience"] && x["audience"].include?("developer") }
  toxic_features = ['beta', 'hide', 'junk', 'scuzzy', 'unhelpful', 'vapor']
  @filters.reject! { |x| x["features"] && (x["features"] & toxic_features).any? }

  @filters.sort! { |a,b|
    if !a["icon"].to_s.empty? && b["icon"].to_s.empty?
      -1
    elsif !b["icon"].to_s.empty? && a["icon"].to_s.empty?
      1
    else
      a["name"] <=> b["name"]
    end
  }
  @filters.each do |x|
   basename = "iconcache/#{x['name'].gsub(/\s+/, '-')}"
   Dir.glob("#{basename}.*") do |i|
     x["icon"] = i
   end
  end
  @filters
end


