def partial(filename)
  contents = File.read(filename + ".html.erb")
  bind = binding
  ERB.new(contents, nil, "-").result(bind)
end
