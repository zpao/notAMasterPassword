#XXXzpao A couple things we should do but won't yet:
#        * read the version number from install.rdf

version := 0.1
xpi_dir = xpi
xpi_files = install.rdf bootstrap.js
xpi_name := notAMasterPassword-$(version).xpi

# makes the xpi
default: setup clean_dsstore make_xpi

# Make sure the directories exist
setup:
	mkdir -p $(xpi_dir)

clean_dsstore:
	find . -name .DS_Store -exec rm {} \;

# Actually make the xpi
make_xpi:
	rm -f $(xpi_dir)/$(xpi_name)
	zip -9r $(xpi_dir)/$(xpi_name) $(xpi_files)

