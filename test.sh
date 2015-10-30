#!/bin/sh -eux

THIS_FILE=$0
THIS_DIR=$(dirname ${THIS_FILE})

test_generate_assets() {
    ${THIS_DIR}/node_modules/grunt-cli/bin/grunt --gruntfile ${THIS_DIR}/Gruntfile.js generate-assets
}

test_run_server() {
    node server.js &
    PID=$!

    sleep 5s
    if ! ps -p ${PID} ; then
        echo "node server not running, assuming it's failed to start up"
        exit 2
    else
        echo "node server was still running, assuming it started successfully."
        kill_test_server ${PID}
        exit 0 # success
    fi
}

kill_test_server() {
    PID=$1
    /bin/kill -SIGTERM ${PID}

    sleep 0.5s
    if ps -p ${PID} ; then
        kill -SIGKILL ${PID}
    fi
}

test_for_diabetes_type_2_wording() {
  if grep -Rin 'diabetes type 2' "${THIS_DIR}/app/"; then
      echo "Found 'diabetes type 2' - should be 'type 2 diabetes'"
      exit 3
  fi
}

test_for_diabetes_type_2_wording
test_generate_assets
test_run_server
