package vectordb

import (
	"sync"

	"github.com/leolee9086/vectordb/storage"
	"github.com/leolee9086/vectordb/vamana"
)

var setDiskReaderOnce sync.Once

func ensureDiskVamanaReader() {
	setDiskReaderOnce.Do(func() {
		vamana.SetOpenDiskIndexReader(storage.OpenReader)
	})
}
