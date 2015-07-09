package util;

import java.io.IOException;

import org.hibernate.collection.internal.PersistentBag;

import com.google.gson.Gson;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

/**
 * This TypeAdapter unproxies Hibernate proxied objects, and serializes them
 * through the registered (or default) TypeAdapter of the base class.
 */
public class PersistentBagTypeAdapter extends TypeAdapter<PersistentBag> {

    public static final TypeAdapterFactory FACTORY = new TypeAdapterFactory() {
        @Override
        @SuppressWarnings("unchecked")
        public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
            return (PersistentBag.class.isAssignableFrom(type.getRawType()) ? (TypeAdapter<T>) new PersistentBagTypeAdapter(gson) : null);
        }
    };
    private final Gson context;

    private PersistentBagTypeAdapter(Gson context) {
        this.context = context;
    }

    @Override
    public PersistentBag read(JsonReader in) throws IOException {
        throw new UnsupportedOperationException("Not supported");
    }

    @Override
    public void write(JsonWriter out, PersistentBag value) throws IOException {
        if (value == null) {
            out.nullValue();
            return;
        }
        out.nullValue();
    }
}