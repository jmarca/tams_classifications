# Download classifications from TAMS database

[![Build Status](https://www.travis-ci.org/jmarca/tams_classifications.svg?branch=master)](https://www.travis-ci.org/jmarca/tams_classifications)
[![Code Climate](https://codeclimate.com/github/jmarca/tams_classifications/badges/gpa.svg)](https://codeclimate.com/github/jmarca/tams_classifications)
[![Test Coverage](https://codeclimate.com/github/jmarca/tams_classifications/badges/coverage.svg)](https://codeclimate.com/github/jmarca/tams_classifications/coverage)

This package will download the classifications assigned to signature
data given a detector and a date range.

# Necessary upgrades

This code was run to completion in July of 2017, processing all of the
database archive tables through June of 2017.

To run for new archive tables, this code needs to be modified as
follows.

First, all of the tables that were already processed are listed in the
file `./data/cached_tables.json`.  Second, I have processed the
out.txt file and have pulled the detectors that were processed through
June of 2017 archive data into the beginning of the file
`get_classifications.js`.

Right now, without any edits, re-running `get_classifications.js` will
not do anything, as all of "cached" tables and all of the detectors
have already been processed.

If you delete the "cached" list of tables (not really recommended as
it takes *forever* to generate it), then the code will revisit all of
the archive tables and extract the first and last timestamp for each
detector stored in each table.  This will have the effect of picking
up new tables.

If you delete the "finished detectors" list (or empty it out), then
the code will re-process each detector.  Again, not recommended.

## Fix one: process new tables

The first fix is to hack the code to first load the
`cached_tables.json` file, figure out all of the DB tables that have
already been processed, and then pull in and process new ones.  At the
end of this step, a new `cached_tables.json` file should be written
out.

## Fix two: process new tables only

Along with the above fix, rather than relying on a hand-coded list of
finished detectors (which was a hack I did for speed of
implementation), a better approach is to look at the data files in the
`./data/` directory, and generate a list of `(database table, detector
id)` pairs that have already been processed.  Using this as the
"finished" list is better, because then only unfinished entries in the
`cached_tables.json` file need to be processed.

## Fix three: add processing state to `cached_tables.json`

Come to think of it, a better approach all around will be to add the
"completed" state to the dumped `cached_tables.json` file.  Because
programs can crash, every time a detector and table are processed and
written out to a data file, the completion state should be added to
the cached tables object and that object should be written out to the
filesystem.  Then then next run can just pick up work by doing only
those tables and detectors that have not yet been marked as done.

# Stopping work on this

As of July 20, 2017, I (James Marca) am stopping work on this code.
