#!/bin/bash

while getopts ":bg:d" option
do
	case $option in
		b)
        		echo "Build binaries"
			cd /usr/src/build
			rm -rf *
			cmake ..
			make -j
			;;
		g)
			echo "Generate keys & encrypt operands"
			cd /usr/src/data
			../build/my_fhe_computation_generate_keys_and_encrypt_datas $2 $3
        		;;
		d)
        		# Decrypt result
        		cd /usr/src/data
			../build/my_fhe_computation_decrypt_result
        		;;
		\?)
        		echo "$OPTARG : invalid option"
        		exit 1
        		;;
	esac
done
