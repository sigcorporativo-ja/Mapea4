package es.juntadeandalucia.mapea.plugins;

import static java.nio.file.LinkOption.NOFOLLOW_LINKS;
import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

public class WatchPluginDir extends Thread {

   private static Logger log = Logger.getLogger(WatchPluginDir.class);
   private static WatchPluginDir instance;
   
   private WatchService watcher;
   private Map<WatchKey, Path> keys;
   private Path pluginsDir;
   
   private WatchPluginDir(Path pluginsDir) {
      try {
         this.watcher = FileSystems.getDefault().newWatchService();
         this.keys = new HashMap<WatchKey, Path>();
         this.pluginsDir = pluginsDir;
      }
      catch (IOException e) {
         log.error("Error occurred while watching the plugins directory: "
               + e.getLocalizedMessage());
      }
   }
   
   @Override
   public void run () {
      try {
         // register directory and sub-directories
         registerEvents(pluginsDir);
         
         // proccess events
         processEvents();
      }
      catch (IOException e) {
         log.error("Error occurred while watching the plugins directory: "
               + e.getLocalizedMessage());
      }
   }

   public static void watch (Path pluginsDir) {
      if (instance == null) {
         instance = new WatchPluginDir(pluginsDir);
         instance.start();
      }
   }

   private void registerEvents (Path pluginDir) throws IOException {
      Files.walkFileTree(pluginDir, new SimpleFileVisitor<Path>() {

         @Override
         public FileVisitResult preVisitDirectory (Path dir, BasicFileAttributes attrs)
               throws IOException {
            WatchKey key = dir.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
            keys.put(key, dir);
            return FileVisitResult.CONTINUE;
         }
      });
   }

   @SuppressWarnings("unchecked")
   private <T> WatchEvent<T> cast (WatchEvent<?> event) {
      return (WatchEvent<T>) event;
   }

   /**
    * Process all events for keys queued to the watcher
    */
   private void processEvents () {
      for (;;) {
         // wait for key to be signalled
         WatchKey key;
         try {
            key = watcher.take();
         }
         catch (InterruptedException x) {
            return;
         }
         Path dir = keys.get(key);
         if (dir == null) {
            log.error("WatchKey not recognized for key: " + key);
            continue;
         }
         for (WatchEvent<?> event : key.pollEvents()) {
            WatchEvent.Kind<?> kind = event.kind();
            // TBD - provide example of how OVERFLOW event is handled
            if (kind == OVERFLOW) {
               continue;
            }
            // Context for directory entry event is the file name of entry
            WatchEvent<Path> ev = cast(event);
            Path name = ev.context();
            Path child = dir.resolve(name);
            // CREATE EVENT then register watcher for directory
            if (kind == ENTRY_CREATE) {
               try {
                  // register events
                  if (Files.isDirectory(child, NOFOLLOW_LINKS)) {
                     registerEvents(child);
                  }
               }
               catch (IOException x) {
                  log.debug("no readable directory: " + child);
               }
            }
            log.debug("fired event " + kind + " for " + child);
            PluginsManager.readPlugins();
         }
         // reset key and remove from set if directory no longer accessible
         boolean valid = key.reset();
         if (!valid) {
            keys.remove(key);
            // all directories are inaccessible
            if (keys.isEmpty()) {
               break;
            }
         }
      }
   }
}
