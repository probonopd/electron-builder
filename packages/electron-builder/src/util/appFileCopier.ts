import BluebirdPromise from "bluebird-lst"
import { AsyncTaskManager } from "builder-util"
import { CONCURRENCY, FileCopier, Link, MAX_FILE_REQUESTS } from "builder-util/out/fs"
import { ensureDir, readlink, symlink } from "fs-extra-p"
import * as path from "path"
import { Packager } from "../packager"
import { ensureEndSlash, FileSet } from "./AppFileCopierHelper"
import { copyFileOrData } from "./asarUtil"

export async function copyAppFiles(fileSet: FileSet, packager: Packager) {
  const metadata = fileSet.metadata
  const transformedFiles = fileSet.transformedFiles
  // search auto unpacked dir
  const taskManager = new AsyncTaskManager(packager.cancellationToken)
  const createdParentDirs = new Set<string>()

  const fileCopier = new FileCopier()
  const links: Array<Link> = []
  for (let i = 0, n = fileSet.files.length; i < n; i++) {
    const sourceFile = fileSet.files[i]
    const stat = metadata.get(sourceFile)
    if (stat == null) {
      // dir
      continue
    }

    const destinationFile = sourceFile === fileSet.src ? fileSet.destination : sourceFile.replace(ensureEndSlash(fileSet.src), ensureEndSlash(fileSet.destination))
    if (stat.isFile()) {
      const newData = transformedFiles == null ? null : transformedFiles[i] as string | Buffer
      if (newData != null) {
        transformedFiles[i] = null
      }

      const fileParent = path.dirname(destinationFile)
      if (!createdParentDirs.has(fileParent)) {
        createdParentDirs.add(fileParent)
        await ensureDir(fileParent)
      }

      taskManager.addTask(copyFileOrData(fileCopier, newData, sourceFile, destinationFile, stat))
      if (taskManager.tasks.length > MAX_FILE_REQUESTS) {
        await taskManager.awaitTasks()
      }
    }
    else if (stat.isSymbolicLink()) {
      links.push({file: destinationFile, link: await readlink(sourceFile)})
    }
  }

  if (taskManager.tasks.length > MAX_FILE_REQUESTS) {
    await taskManager.awaitTasks()
  }
  if (links.length > 0) {
    BluebirdPromise.map(links, it => symlink(it.link, it.file), CONCURRENCY)
  }
}