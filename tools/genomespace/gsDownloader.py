import gsLogin
from abc import ABCMeta, abstractmethod
import requests.packages.urllib3.util.ssl_
requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS = 'ALL'
import shutil
import sys
import argparse

class Downloader:

	#__metaclass__ = ABCMeta
    def request_download(self, gsURL, gsDNS, filePath, gsUserName, gsPasword, gsToken):
        print "downloading " + gsURL
        if gsToken:
            r = requests.get(gsURL, stream=True, cookies={"gs-token" : gsToken})
        else:
            print { 'Cookie' : gsLogin.get_genomespace_token(gsUserName, gsPasword, gsDNS) }
            r = requests.get(gsURL, stream=True, cookies=gsLogin.get_genomespace_token(gsUserName, gsPasword, gsDNS))
        with open(filePath, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    f.flush()

def test():
    a = Downloader()
    #a.requestDownload("Home/swift:Demo2/2.lg.txt", "genomespace.genome.edu.au","/Users/yousef/Documents/Uploader2GenomeSpace/gsUploader/ss1.png", "devtest","devtest", None)
    a.request_download("https://genomespace-dev.genome.edu.au:443/datamanager/file/Home/swift:Demo2/testfile.txt", "genomespace.genome.edu.au","/Users/yousef/Documents/Uploader2GenomeSpace/gsUploader/ss1.png", None, None, "UYEP4NI1gHVOSvXEu+wXR0OozF/Vk1zf")

def download_file_from_genomespace(server, download_url, local_filename, user=None, password=None, token=None):
    a = Downloader()
    a.request_download(download_url, server, local_filename, user, password, token)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--server', type=str, help="Genomespace server name", required=True)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-u', '--user', type=str, help="Genomespace username")
    group.add_argument('-p', '--password', type=str, help="Genomespace password")
    group.add_argument('-n', '--token', help="Genomespace token to talk to GenomeSpace")
    parser.add_argument('-d', '--download_url', help="Genomespace URI of file to download", required=True)
    parser.add_argument('-f', '--file', type=str, help="Local filename to save to", required=False, default="output.download")

    args = parser.parse_args()

    if len([x for x in (args.user, args.password) if x is not None]) == 1:
       parser.error('--user and --password must be given together')

    download_file_from_genomespace(args.server, args.download_url, args.file, user=args.user, password=args.password, token=args.token)
